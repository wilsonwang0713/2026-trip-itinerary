import { DaySchedule, ActivityType, RecommendationGroup } from './types';
import { Coffee, Utensils, BedDouble } from 'lucide-react';

export const TRIP_TITLE = "2026/01/01 – 01/04";
export const TRIP_SUBTITLE = "旅遊行程總覽";
export const MAP_LINK = "https://maps.app.goo.gl/bzbGuRGQQXEEeK3TA";

export const TAICHUNG_RECOMMENDATIONS: RecommendationGroup[] = [
  {
    category: "咖啡 / 甜點",
    icon: Coffee,
    items: [
      { name: "植光圈 VEGAN DONUTS", coordinates: { lat: 24.1436, lng: 120.6775 } },
      { name: "Ritrovare coffee PLUS", coordinates: { lat: 24.1563, lng: 120.6559 } },
      { name: "留白計畫 blank plan", coordinates: { lat: 24.1375, lng: 120.6635 } },
      { name: "NOD COFFEE BAR", coordinates: { lat: 24.1492, lng: 120.6681 } },
      { name: "Peacocks Coffee", coordinates: { lat: 24.1450, lng: 120.6830 } },
      { name: "MINIMAL Dessert", coordinates: { lat: 24.1515, lng: 120.6620 } }
    ]
  },
  {
    category: "順遊餐廳",
    icon: Utensils,
    items: [
      { name: "Salt and Pepper Restaurant", coordinates: { lat: 24.1530, lng: 120.6435 } },
      { name: "翁記泡沫廣場", coordinates: { lat: 24.1485, lng: 120.6845 } }
    ]
  }
];

export const ITINERARY_DATA: DaySchedule[] = [
  {
    date: "1/1",
    dayOfWeek: "四",
    title: "北 → 中",
    items: [
      {
        id: "d1-train",
        time: "08:36",
        endTime: "09:42",
        title: "高鐵 1509 (自由座)",
        type: ActivityType.TRANSPORT,
        description: "台北 / 桃園 → 台中",
        details: [
          "台北 08:36（Peipei 上車）",
          "桃園 09:01（我上車）",
          "台中 09:42 抵達"
        ],
        coordinates: { lat: 24.1120, lng: 120.6156 } // Taichung HSR
      },
      {
        id: "d1-day",
        time: "白天",
        title: "台中市區活動",
        type: ActivityType.ACTIVITY,
        description: "可搭配下方咖啡 / 景點清單",
        isHighlight: true
      },
      {
        id: "d1-hotel",
        time: "Check-in",
        title: "慕雲旅店",
        location: "Mu Yun Hotel",
        type: ActivityType.HOTEL,
        coordinates: { lat: 24.1428, lng: 120.6835 }
      },
      {
        id: "d1-dinner",
        time: "19:30",
        title: "茶六燒肉堂 公益店",
        type: ActivityType.FOOD,
        details: [
          "人數：2 位",
          "訂位：陳姵妏"
        ],
        coordinates: { lat: 24.1512, lng: 120.6515 }
      }
    ],
    recommendations: TAICHUNG_RECOMMENDATIONS
  },
  {
    date: "1/2",
    dayOfWeek: "五",
    title: "台中小旅行",
    items: [
      {
        id: "d2-day",
        time: "白天",
        title: "台中小旅行",
        type: ActivityType.ACTIVITY,
        description: "探索咖啡店與市區景點",
        isHighlight: true
      },
      {
        id: "d2-hotel",
        time: "Check-in",
        title: "縵和旅居",
        location: "Harmony Hotel",
        type: ActivityType.HOTEL,
        coordinates: { lat: 24.1415, lng: 120.6780 }
      },
      {
        id: "d2-dinner",
        time: "19:00",
        title: "湯棧 公益店",
        type: ActivityType.FOOD,
        details: [
          "人數：2 位",
          "訂位：陳姵妏"
        ],
        coordinates: { lat: 24.1519, lng: 120.6433 }
      }
    ],
    recommendations: TAICHUNG_RECOMMENDATIONS
  },
  {
    date: "1/3",
    dayOfWeek: "六",
    title: "中 → 南",
    items: [
      {
        id: "d3-transport",
        time: "08:05",
        endTime: "10:43",
        title: "台中 → 屏東",
        type: ActivityType.TRANSPORT,
        description: "搭乘高鐵轉乘台鐵",
        coordinates: { lat: 22.6690, lng: 120.4860 } // Approx Pingtung area
      },
      {
        id: "d3-meet",
        time: "11:30",
        title: "集合",
        type: ActivityType.MEETING,
        location: "City Parking 屏東民權站對面 The One",
        isHighlight: true,
        coordinates: { lat: 22.6714, lng: 120.4870 } // Approx
      },
      {
        id: "d3-hotel",
        time: "Check-in",
        title: "屏東住宿",
        location: "No. 42, Ruihua St, Pingtung City, Pingtung County, 900",
        type: ActivityType.HOTEL,
        coordinates: { lat: 22.665276, lng: 120.508787 }
      }
    ]
  },
  {
    date: "1/4",
    dayOfWeek: "日",
    title: "南 → 北",
    items: [
      {
        id: "d4-return",
        time: "17:35",
        endTime: "19:09",
        title: "高鐵 670",
        type: ActivityType.TRANSPORT,
        description: "左營 → 桃園",
        details: [
          "訂位代號：01471890",
          "座位：5 車 10C"
        ],
        coordinates: { lat: 22.6874, lng: 120.3090 } // Zouying HSR
      }
    ]
  }
];