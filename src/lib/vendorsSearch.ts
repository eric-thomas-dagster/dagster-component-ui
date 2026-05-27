/** Search helpers for `vendors/README.md` and vendor pages (reuses examples index logic). */

export {
  countExampleIndexEntries as countVendorIndexEntries,
  examplesReadmeBodyMatches as vendorsReadmeBodyMatches,
  findExampleLinkHits as findVendorLinkHits,
  filterExamplesReadmeByQuery as filterVendorsReadmeByQuery,
  type ExampleLinkHit as VendorLinkHit,
} from "./examplesSearch";
