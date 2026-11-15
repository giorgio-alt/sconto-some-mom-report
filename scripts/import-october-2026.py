"""Rebuild October records and creative crops from the archived Meta exports."""

import csv
import json
import re
import unicodedata
from pathlib import Path

import openpyxl
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "reference-library/2026-10"
MONTH = "2026-10"


def crops(page, ys, x=280):
    return [(f"{page:02}.png", (x, y, x + 61, y + 62)) for y in ys]


SEGMENTS = [
    ("clanek-cz-report", "CZ", "facebook", 6, 178.03, 1403,
     crops(1, [283, 389, 495, 601, 707, 813])),
    ("clanek-sk-report", "SK", "facebook", 7, 190.46, 1418,
     crops(1, [283, 389, 495, 601, 707, 813]) + crops(2, [268])),
    ("fb-posts-cz", "CZ", "facebook", 21, 366.50, 101860,
     crops(1, [283, 389, 495, 601, 707, 813])
     + crops(2, [268, 374, 480, 586, 692, 798])
     + crops(3, [268, 374])
     + [("extra-preview", (55, 431, 285, 662))]
     + crops(3, [522, 628, 734]) + crops(4, [268, 374, 480])),
    ("fb-posts-sk", "SK", "facebook", 21, 361.50, 125432,
     crops(1, [267, 373, 479, 585, 691, 797], 288)
     + crops(2, [267, 373, 479, 585, 691, 797], 288)
     + crops(3, [267, 373, 479, 585, 691, 797], 288)
     + crops(4, [252, 357, 463], 288)),
    ("ig-post-reporting-cz", "CZ", "instagram", 19, 306.32, 69204,
     crops(1, [283, 389, 495, 601, 707, 813])
     + crops(2, [283, 389, 495, 601, 707, 813])
     + crops(3, [283, 389, 495, 601, 707, 813]) + crops(4, [268])),
    ("ig-post-reporting-sk", "SK", "instagram", 17, 304.79, 73845,
     crops(1, [226, 332, 438, 544, 650, 756], 88)
     + crops(2, [226, 332, 438, 544, 650], 88)
     + crops(3, [211, 317, 423, 529], 88) + crops(4, [211, 317], 88)),
]


def read_rows(folder):
    xlsx = folder / "export.xlsx"
    if xlsx.exists():
        book = openpyxl.load_workbook(xlsx, data_only=True, read_only=True)
        values = list(book.active.values)
        rows = [dict(zip(values[0], row)) for row in values[1:]]
        book.close()
        return [row for row in rows if row.get("Ads") == "All"]
    with (folder / "export.csv").open(encoding="utf-8-sig", newline="") as file:
        return list(csv.DictReader(file))


def slugify(value):
    value = unicodedata.normalize("NFD", value).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")


def optional_number(row, field):
    value = row.get(field)
    return float(value) if value not in (None, "") else None


records, manifest, segment_totals, previews = [], [], [], []
for segment, country, platform, count, spend, results, bounds in SEGMENTS:
    folder = SOURCE / segment
    rows = read_rows(folder)
    assert len(rows) == count == len(bounds), segment
    assert round(sum(float(row["Amount spent (EUR)"]) for row in rows), 2) == spend, segment
    result_field = "Post engagements" if segment == "ig-post-reporting-sk" else "Results"
    assert sum(int(float(row[result_field])) for row in rows) == results, segment
    segment_totals.append(dict(segment=segment, count=count, spend=spend, results=results))
    for index, (data, (page, box)) in enumerate(zip(rows, bounds)):
        assert data["Reporting starts"] == "2026-10-01", data
        assert data["Reporting ends"] == "2026-10-31", data
        name = data.get("Ad name") or data["Ad set name"]
        parts = re.split(r"\s+-\s+", name)
        date, title = parts[0], parts[-1].strip()
        assert re.fullmatch(r"\d{2}/\d{2}/2026", date), date
        is_article = segment.startswith("clanek")
        content = "article" if is_article else "reel" if "reels" in parts else "video" if "video" in parts else "post"
        expected_type = "Landing page views" if is_article else "Post engagements"
        assert data.get("Result type", "Post engagements") == expected_type, name
        title = {"loznice": "ložnice", "bojí se vaše deti tmy?": "bojí se vaše děti tmy?"}.get(title, title)
        title = title.replace("_", ", ")
        title = title[0].upper() + title[1:]
        slug = slugify(title + "-" + date)
        thumbnail_folder = {"article": "articles", "reel": "reels", "video": "video", "post": "posts"}[content]
        thumbnail = f"/thumbnails/{MONTH}/{country.lower()}/{platform}/{thumbnail_folder}/{slug}.png"
        value = int(float(data[result_field]))
        cost = float(data["Amount spent (EUR)"]) / value if value else None
        record = dict(
            id=f"{MONTH}-{country.lower()}-{platform}-{content}-{slug}",
            country=country, platform=platform, contentType=content, sourceName=name,
            title=title, date=date.replace("/", "."), month_key=MONTH,
            spendEur=float(data["Amount spent (EUR)"]), reach=int(float(data["Reach"])),
            frequency=optional_number(data, "Frequency"),
            cpmEur=optional_number(data, "CPM (cost per 1,000 impressions)"),
            linkClicks=optional_number(data, "Link clicks"),
            cpcEur=optional_number(data, "CPC (cost per link click)"),
            ctrPct=optional_number(data, "CTR (link click-through rate)"),
            resultType="landing_page_view" if is_article else "post_engagement",
            results=value, costPerResultEur=cost,
            engagements=None if is_article else value, cpeEur=None if is_article else cost,
            landingPageViews=value if is_article else None,
            costPerLandingPageViewEur=cost if is_article else None,
            rankingEligible=value > 0, thumbnail=thumbnail,
        )
        records.append(record)
        if page == "extra-preview":
            image_path = folder / "extra-preview-predsin.png"
        else:
            image_path = (SOURCE / "ig-report-sk" if segment == "ig-post-reporting-sk" else folder) / page
        with Image.open(image_path) as source:
            assert 0 <= box[0] < box[2] <= source.width and 0 <= box[1] < box[3] <= source.height
            crop = source.crop(box).convert("RGB")
            target = ROOT / "public" / thumbnail.lstrip("/")
            target.parent.mkdir(parents=True, exist_ok=True)
            crop.save(target, optimize=True)
            manifest.append(dict(id=record["id"], source=str(image_path.relative_to(SOURCE)),
                                 sourceSize=list(source.size), bounds=list(box), thumbnail=thumbnail))
            previews.append((country + " " + platform[:2] + " " + title, crop.copy()))

assert len(records) == len({row["id"] for row in records}) == 91
assert round(sum(row["spendEur"] for row in records), 2) == 1707.60
assert sum(row["engagements"] or 0 for row in records) == 370341
assert sum(row["landingPageViews"] or 0 for row in records) == 2821
header = '// Generated by scripts/import-october-2026.py from archived Meta exports.\nimport type { ReportRow } from "./report-data";\n\nexport const OCTOBER_2026_RECORDS = '
(ROOT / "src/october-data.ts").write_text(header + json.dumps(records, ensure_ascii=False, indent=2) + " satisfies ReportRow[];\n")
(SOURCE / "crop-manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
(SOURCE / "reconciled-totals.json").write_text(json.dumps(segment_totals, indent=2) + "\n")

sheet = Image.new("RGB", (800, ((len(previews) + 7) // 8) * 120), "white")
draw = ImageDraw.Draw(sheet)
for index, (label, crop) in enumerate(previews):
    x, y = (index % 8) * 100, (index // 8) * 120
    crop.thumbnail((90, 90))
    sheet.paste(crop, (x + 5, y))
    draw.text((x + 3, y + 92), str(index + 1) + " " + label[:13], fill="black")
sheet.save("/tmp/sconto-october-crops.png")
print(json.dumps(segment_totals, indent=2))
print(f"Imported {len(records)} records and creative crops.")
