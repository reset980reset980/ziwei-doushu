export interface CityInfo {
  name: string;
  longitude: number;
}

export interface ProvinceInfo {
  name: string;
  cities: CityInfo[];
}

export const PROVINCES: ProvinceInfo[] = [
  { name: '서울특별시', cities: [{ name: '서울', longitude: 126.98 }] },
  { name: '부산광역시', cities: [{ name: '부산', longitude: 129.08 }] },
  { name: '대구광역시', cities: [{ name: '대구', longitude: 128.60 }] },
  { name: '인천광역시', cities: [{ name: '인천', longitude: 126.71 }] },
  { name: '광주광역시', cities: [{ name: '광주', longitude: 126.85 }] },
  { name: '대전광역시', cities: [{ name: '대전', longitude: 127.38 }] },
  { name: '울산광역시', cities: [{ name: '울산', longitude: 129.31 }] },
  { name: '세종특별자치시', cities: [{ name: '세종', longitude: 127.29 }] },
  {
    name: '경기도',
    cities: [
      { name: '수원', longitude: 127.03 },
      { name: '고양', longitude: 126.83 },
      { name: '용인', longitude: 127.18 },
      { name: '성남', longitude: 127.13 },
      { name: '부천', longitude: 126.77 },
      { name: '안산', longitude: 126.83 },
      { name: '안양', longitude: 126.96 },
      { name: '평택', longitude: 127.11 },
      { name: '의정부', longitude: 127.05 },
      { name: '파주', longitude: 126.78 },
    ],
  },
  {
    name: '강원특별자치도',
    cities: [
      { name: '춘천', longitude: 127.73 },
      { name: '원주', longitude: 127.92 },
      { name: '강릉', longitude: 128.88 },
      { name: '속초', longitude: 128.59 },
    ],
  },
  {
    name: '충청북도',
    cities: [
      { name: '청주', longitude: 127.49 },
      { name: '충주', longitude: 127.93 },
      { name: '제천', longitude: 128.19 },
    ],
  },
  {
    name: '충청남도',
    cities: [
      { name: '천안', longitude: 127.15 },
      { name: '공주', longitude: 127.12 },
      { name: '보령', longitude: 126.61 },
      { name: '아산', longitude: 127.00 },
      { name: '서산', longitude: 126.45 },
    ],
  },
  {
    name: '전북특별자치도',
    cities: [
      { name: '전주', longitude: 127.15 },
      { name: '군산', longitude: 126.74 },
      { name: '익산', longitude: 126.96 },
      { name: '정읍', longitude: 126.86 },
    ],
  },
  {
    name: '전라남도',
    cities: [
      { name: '목포', longitude: 126.39 },
      { name: '여수', longitude: 127.66 },
      { name: '순천', longitude: 127.49 },
      { name: '나주', longitude: 126.72 },
    ],
  },
  {
    name: '경상북도',
    cities: [
      { name: '포항', longitude: 129.37 },
      { name: '경주', longitude: 129.22 },
      { name: '김천', longitude: 128.11 },
      { name: '안동', longitude: 128.73 },
      { name: '구미', longitude: 128.34 },
    ],
  },
  {
    name: '경상남도',
    cities: [
      { name: '창원', longitude: 128.68 },
      { name: '진주', longitude: 128.08 },
      { name: '통영', longitude: 128.43 },
      { name: '김해', longitude: 128.89 },
      { name: '거제', longitude: 128.62 },
    ],
  },
  {
    name: '제주특별자치도',
    cities: [
      { name: '제주', longitude: 126.53 },
      { name: '서귀포', longitude: 126.56 },
    ],
  },
  {
    name: '해외/직접 보정',
    cities: [
      { name: '도쿄', longitude: 139.69 },
      { name: '오사카', longitude: 135.50 },
      { name: '베이징', longitude: 116.40 },
      { name: '상하이', longitude: 121.47 },
      { name: '뉴욕', longitude: -74.01 },
      { name: '로스앤젤레스', longitude: -118.24 },
    ],
  },
];
