import axios from "axios";

const KAKAO_REST_KEY = process.env.REACT_APP_KAKAO_REST_KEY; // CRA 방식
// 키가 undefined면 바로 눈에 띄게 에러 던지기 (개발중 디버깅 편함)
if (!KAKAO_REST_KEY) {
  // eslint-disable-next-line no-console
  console.error("Kakao REST KEY is missing. Check your .env (REACT_APP_KAKAO_REST_KEY).");
}

export const kakao = axios.create({
  baseURL: "https://dapi.kakao.com",
  headers: { Authorization: `KakaoAK ${KAKAO_REST_KEY}` },
});

export async function getRegionByAddress(query) {
  const { data } = await kakao.get("/v2/local/search/address.json", {
    params: { query, size: 1 },
  });
  const doc = data?.documents?.[0];
  const addr = doc?.address || doc?.road_address;
  if (!addr) return null;
  return {
    sido: addr.region_1depth_name,
    sigungu: addr.region_2depth_name,
    dong: addr.region_3depth_name,
  };
}
