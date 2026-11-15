# Reference library - October 2026

Source: `sconto-2026-10.zip` and the completed `sconto-2026-10-v2.zip`, supplied on 2026-11-15. All date-range headers show October 1-31, 2026. Original screenshots and supplied manifests are preserved in their original folders. The five XLSX exports and Slovak Instagram CSV in v2 are the primary source of full names and numeric values; screenshots provide creative previews and independent total checks.

## Reconciled Totals

The following totals were independently summed from the visible ad rows and match the screenshot totals. Creative breakdown rows are not counted twice.

| Segment | Unique ads | Spend EUR | Results |
| --- | ---: | ---: | ---: |
| CZ Facebook articles | 6 | 178.03 | 1,403 LPV |
| SK Facebook articles | 7 | 190.46 | 1,418 LPV |
| CZ Facebook posts/videos | 21 | 366.50 | 101,860 engagements |
| SK Facebook posts/videos | 21 | 361.50 | 125,432 engagements |
| CZ Instagram posts/reels | 19 | 306.32 | 69,204 engagements |
| SK Instagram posts/reels | 17 | 304.79 | 73,845 engagements |
| Total | 91 | 1,707.60 | 370,341 engagements + 2,821 LPV |

Account reach in the screenshot footer is deduplicated and must not replace summed ad-row reach in the existing report methodology. Publication dates before October do not change the reporting month.

## Duplicate Evidence

`ig-post-reporting-sk` and `ig-report-sk` show the same campaign ID (23852359616940116), reporting period, 17 ads, row values and totals. They are alternate captures of one dataset, not two datasets. Preserve both sets as evidence, but import each ad only once.

## Resolved Import Notes

- The v2 exports resolve the truncated ad names. `sourceName` preserves exact exported text; display titles normalize initial capitalization, the `loznice`/`deti` spelling, and the underscore in `centimetr_zeleny gauc`.
- The 19/10/2026 Czech Facebook carousel ad with spend EUR 11.90, reach 6,874 and 626 engagements is `predsin`. Its separate v2 preview supplies the missing creative. The thumbnail crops only the creative collage, excluding the surrounding Meta preview dialog. The original screenshot footer discrepancy (41 rows versus 42 in the manifest) does not remove an ad: all 21 ad-level rows reconcile to the totals.
- Articles remain LPV-based and ranking-eligible; they are not engagement-optimization mismatches. All visible non-article rows report post engagements.
- Only `Ads = All` rows are imported from the XLSX files. The Slovak Instagram CSV already contains one row per ad. Its creative crops use the complete `ig-report-sk` screenshot set; the alternate set is not imported separately.
- Spend and result counts are taken from the exports. CPE and Cost / LPV are computed as spend / results without averaging rounded source rates. Other exported rates retain their available precision; unavailable CPM stays null.
- Reporting month is October even when the source publication date is in July, August or September. The two Slovak article ads about kitchen islands retain separate dates and IDs.

## Reproduction and Validation

`scripts/import-october-2026.py` reads the archived exports, verifies dates/counts/totals, and regenerates `src/october-data.ts`, the 91 creative thumbnails, `crop-manifest.json` and `reconciled-totals.json`. It requires Python with openpyxl and Pillow. The crop manifest records exact source bounds for every thumbnail.

October is included in `REPORT_DATA`; existing month selectors, total/monthly summaries and metric charts discover it automatically. Existing data, layout, median benchmarks and unrelated local thumbnail deletions are unchanged.
