let sheetRange = "Sheet1!A1:G200";

const getVars = (payload) => {
  const SPREAD_SHEET_ID = payload;
  const GOOGLE_API_KEY = useRuntimeConfig().public.GOOGLE_API_KEY;

  return { SPREAD_SHEET_ID, GOOGLE_API_KEY };
};

export async function allRows(payload) {
  const { SPREAD_SHEET_ID, GOOGLE_API_KEY } = getVars(payload);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREAD_SHEET_ID}/values/${sheetRange}?key=${GOOGLE_API_KEY}`;
  return await useFetch(url);
}
