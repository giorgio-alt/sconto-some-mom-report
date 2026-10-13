# Reference library - September 2026

Source: `Sconto 09-26.zip`, supplied on 2026-10-13. All date-range headers show September 1-30, 2026.

## Source Screenshots

- `cz-fb-clanky.png`, `sk-fb-clanky.png`: Facebook articles, six unique ads per country.
- `cz-fb-posty-1.png`, `cz-fb-posty-2.png`: Czech Facebook posts/videos, fifteen unique ads.
- `sk-fb-posty-1.png`, `sk-fb-posty-2.png`: Slovak Facebook posts/videos, fifteen unique ads.
- `cz-ig-1.png`, `cz-ig-2.png`, `cz-ig-3.png`: Czech Instagram posts/reels, eighteen unique ads.
- `sk-ig-1.png`, `sk-ig-2.png`: Slovak Instagram posts/reels, sixteen unique ads.
- `crop-manifest.json`: source image dimensions and exact pixel bounds for all 76 creative thumbnails.

## Import Rules

- Each ad is counted once. Summary and creative breakdown rows are not duplicated.
- September is the reporting month, even for ads originally published in June, July or August. Original publication dates are preserved.
- Articles use landing page views and cost per landing page view. They remain ranking-eligible and are not treated as engagement optimization mismatches.
- Every visible non-article row reports post engagements. CPE is computed from spend / engagements, using unrounded input values.
- Missing metrics remain null; Slovak non-article exports do not show CPM.
- The Czech Facebook `Ruzova` row displays the same creative as `TWENTY` in the supplied export. Its thumbnail follows the source rather than replacing it with the Instagram creative.
- Original screenshots are archived here. The report uses standalone creative crops under `public/thumbnails/2026-09/`.

## Reconciled Totals

| Segment | Unique ads | Spend EUR | Results |
| --- | ---: | ---: | ---: |
| CZ Facebook articles | 6 | 178.32 | 1,304 LPV |
| SK Facebook articles | 6 | 184.46 | 1,662 LPV |
| CZ Facebook posts/videos | 15 | 286.13 | 89,791 engagements |
| SK Facebook posts/videos | 15 | 290.25 | 102,730 engagements |
| CZ Instagram posts/reels | 18 | 282.44 | 62,215 engagements |
| SK Instagram posts/reels | 16 | 277.44 | 66,103 engagements |

The Czech Instagram source does not include an account-total row. Its values above are sums of all visible unique ads. Account reach is deduplicated by Meta and is not equal to the sum of ad-row reach used by the existing report.
