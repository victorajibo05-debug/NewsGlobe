import { useState, useCallback, useRef, useEffect } from "react";
import GlobeComponent from "./components/globe";
import {Sidebar} from "./components/sidebar";
import {NewsCard} from "./components/newsCard";
import { BottomSheet } from "./components/bottomsheet";
import { useFetchNews } from "./hooks/useFetchnews";
import type { NewsArticle } from "./hooks/useFetchnews";
import type { GlobeMarker } from "./components/types/types";
import { GlobeOverlay } from "./components/GlobeOverlay";


const MARKERS: GlobeMarker[] = [
  { lat: 37.09,  lng: -95.71,  country: "United States",  countryCode: "us", label: "🇺🇸 USA",          size: 2, color: "#3B82F6" },
  { lat: 51.51,  lng: -0.13,   country: "United Kingdom", countryCode: "gb", label: "🇬🇧 UK",           size: 2, color: "#8B5CF6" },
  { lat: 52.52,  lng: 13.41,   country: "Germany",        countryCode: "de", label: "🇩🇪 Germany",      size: 2, color: "#F59E0B" },
  { lat: 48.86,  lng: 2.35,    country: "France",         countryCode: "fr", label: "🇫🇷 France",       size: 2, color: "#EF4444" },
  { lat: 35.69,  lng: 139.69,  country: "Japan",          countryCode: "jp", label: "🇯🇵 Japan",        size: 2, color: "#EC4899" },
  { lat: 39.91,  lng: 116.39,  country: "China",          countryCode: "cn", label: "🇨🇳 China",        size: 2, color: "#10B981" },
  { lat: 28.61,  lng: 77.21,   country: "India",          countryCode: "in", label: "🇮🇳 India",        size: 2, color: "#F97316" },
  { lat: -14.24, lng: -51.93,  country: "Brazil",         countryCode: "br", label: "🇧🇷 Brazil",       size: 2, color: "#22C55E" },
  { lat: -25.27, lng: 133.78,  country: "Australia",      countryCode: "au", label: "🇦🇺 Australia",    size: 2, color: "#06B6D4" },
  { lat: 56.13,  lng: -106.35, country: "Canada",         countryCode: "ca", label: "🇨🇦 Canada",       size: 2, color: "#EF4444" },
  { lat: 9.08,   lng: 8.68,    country: "Nigeria",        countryCode: "ng", label: "🇳🇬 Nigeria",      size: 2, color: "#84CC16" },
  { lat: -30.56, lng: 22.94,   country: "South Africa",   countryCode: "za", label: "🇿🇦 South Africa", size: 2, color: "#FBBF24" },
  { lat: 23.42,  lng: 53.85,   country: "UAE",            countryCode: "ae", label: "🇦🇪 UAE",          size: 2, color: "#A78BFA" },
  { lat: 7.9465,  lng:1.0232,  country: "Ghana",          countryCode: "gh", label: "🇬🇭 Ghana",        size: 2, color: "#F87171" },
  { lat: 41.90,  lng: 12.45,   country: "Italy",          countryCode: "it", label: "🇮🇹 Italy",        size: 2, color: "#34D399" },
  { lat: 55.37,  lng: 10.42,   country: "Denmark",        countryCode: "dk", label: "🇩🇰 Denmark",      size: 2, color: "#3B82F6" },
  {lat: 60.17,  lng: 24.94,   country: "Finland",        countryCode: "fi", label: "🇫🇮 Finland",      size: 2, color: "#8B5CF6" },
  {lat: 59.33,  lng: 18.07,   country: "Sweden",         countryCode: "se", label: "🇸🇪 Sweden",       size: 2, color: "#F59E0B" },
  {lat: 45.75,  lng: 4.83,    country: "Switzerland",    countryCode: "ch", label: "🇨🇭 Switzerland",  size: 2, color: "#EF4444" },
  {lat: 35.68,  lng: 51.41,   country: "Iran",           countryCode: "ir", label: "🇮🇷 Iran",         size: 2, color: "#EC4899" },
  {lat: 31.95,  lng: 35.93,   country: "Israel",         countryCode: "il", label: "🇮🇱 Israel",         size: 2, color: "#EF4444" },
  {lat: 19.43,  lng: -99.13,  country: "Mexico",         countryCode: "mx", label: "🇲🇽 Mexico",       size: 2, color: "#F97316" },
  {lat: 43.90,  lng: 125.35,  country: "North Korea",    countryCode: "kp", label: "🇰🇵 North Korea",  size: 2, color: "#10B981" },
  {lat: 35.86,  lng: 104.19,  country: "China",          countryCode: "cn", label: "🇨🇳 China",        size: 2, color: "#22C55E" },
  {lat: 36.20,  lng: 138.25,  country: "Japan",          countryCode: "jp", label: "🇯🇵 Japan",        size: 2, color: "#06B6D4" },
  {lat: 55.75,  lng: 37.62,   country: "Russia",         countryCode: "ru", label: "🇷🇺 Russia",       size: 2, color: "#EF4444" },
  {lat: 1.35,   lng: 103.82,  country: "Singapore",      countryCode: "sg", label: "🇸🇬 Singapore",    size: 2, color: "#FBBF24" },
  {lat: 13.41,  lng: 103.86,  country: "Cambodia",       countryCode: "kh", label: "🇰🇭 Cambodia",     size: 2, color: "#A78BFA" },
  {lat: 14.55,  lng: 121.02,  country: "Philippines",    countryCode: "ph", label: "🇵🇭 Philippines",  size: 2, color: "#F87171" },
  {lat: 52.23,  lng: 21.01,   country: "Poland",         countryCode: "pl", label: "🇵🇱 Poland",       size: 2, color: "#34D399" },
  {lat: 50.45,  lng: 30.52,   country: "Ukraine",        countryCode: "ua", label: "🇺🇦 Ukraine",      size: 2, color: "#3B82F6" },
  {lat: 33.44,  lng: 126.98,  country: "South Korea",    countryCode: "kr", label: "🇰🇷 South Korea",  size: 2, color: "#8B5CF6" },
  {lat: 24.86,  lng: 67.01,   country: "Pakistan",       countryCode: "pk", label: "🇵🇰 Pakistan",     size: 2, color: "#F59E0B" },
  {lat:14.4974, lng:14.4524, country: 'Senegal',        countryCode: 'sn', label: "🇸🇳 Senegal",      size: 2, color: "#EF4444" },
  {lat:31.7917, lng:7.0926, country: 'Morocco',         countryCode: 'ma', label: "🇲🇦 Morocco",      size: 2, color: "#EC4899" },
  {lat: 9.3077, lng: 2.3158, country: 'Benin',           countryCode: 'bj', label: "🇧🇯 Benin",        size: 2, color: "#10B981" },
  {lat: 12.5,   lng: 13.6,    country: "Niger",          countryCode: "ne", label: "🇳🇪 Niger",        size: 2, color: "#F97316" },
  {lat: 13.19,  lng: 1.55,    country: "Togo",           countryCode: "tg", label: "🇹🇬 Togo",         size: 2, color: "#22C55E" },
  {lat: 36.77,  lng: 3.06,    country: "Algeria",        countryCode: "dz", label: "🇩🇿 Algeria",      size: 2, color: "#06B6D4" },
  {lat: 48.86,  lng: 2.35,    country: "France",         countryCode: "fr", label: "🇫🇷 France",       size: 2, color: "#EF4444" },
  {lat: 36.77,  lng: 3.06,    country: "Algeria",        countryCode: "dz", label: "🇩🇿 Algeria",      size: 2, color: "#06B6D4" },
  { lat: -38.42, lng: -63.62, country: "Argentina", countryCode: "ar", label: "🇦🇷 Argentina", size: 2, color: "#74C0FC" },
  { lat: -9.19,  lng: -75.02, country: "Peru",      countryCode: "pe", label: "🇵🇪 Peru",      size: 2, color: "#F03E3E" },
  { lat: 4.57,   lng: -74.30, country: "Colombia",  countryCode: "co", label: "🇨🇴 Colombia",  size: 2, color: "#FCC419" },
  { lat: -23.43, lng: -58.44, country: "Paraguay",  countryCode: "py", label: "🇵🇾 Paraguay",  size: 2, color: "#94D82D" },
  { lat: -32.52, lng: -55.77, country: "Uruguay",   countryCode: "uy", label: "🇺🇾 Uruguay",   size: 2, color: "#4DABF7" },
  { lat: -16.29, lng: -63.59, country: "Bolivia",   countryCode: "bo", label: "🇧🇴 Bolivia",   size: 2, color: "#FF922B" },
  { lat: -35.68, lng: -71.54, country: "Chile",     countryCode: "cl", label: "🇨🇱 Chile",     size: 2, color: "#F76707" },
  { lat: -1.83,  lng: -78.18, country: "Ecuador",   countryCode: "ec", label: "🇪🇨 Ecuador",   size: 2, color: "#2F9E44" },
  { lat: 8.00,   lng: -66.59, country: "Venezuela", countryCode: "ve", label: "🇻🇪 Venezuela",  size: 2, color: "#E64980" },
  { lat: 4.86,   lng: -58.93, country: "Guyana",    countryCode: "gy", label: "🇬🇾 Guyana",    size: 2, color: "#862E9C" },
  { lat: 3.92,   lng: -56.03, country: "Suriname",  countryCode: "sr", label: "🇸🇷 Suriname",  size: 2, color: "#1971C2" },
  { lat: 9.08,   lng: 8.68,   country: "Nigeria",           countryCode: "ng", label: "🇳🇬 Nigeria",           size: 0.5, color: "#84CC16" },
{ lat: -30.56, lng: 22.94,  country: "South Africa",      countryCode: "za", label: "🇿🇦 South Africa",      size: 0.5, color: "#FBBF24" },
{ lat: 26.82,  lng: 30.80,  country: "Egypt",             countryCode: "eg", label: "🇪🇬 Egypt",             size: 0.5, color: "#F97316" },
{ lat: 1.37,   lng: 32.29,  country: "Uganda",            countryCode: "ug", label: "🇺🇬 Uganda",            size: 0.5, color: "#EF4444" },
{ lat: -1.94,  lng: 29.87,  country: "Rwanda",            countryCode: "rw", label: "🇷🇼 Rwanda",            size: 0.5, color: "#3B82F6" },
{ lat: -6.37,  lng: 34.89,  country: "Tanzania",          countryCode: "tz", label: "🇹🇿 Tanzania",          size: 0.5, color: "#10B981" },
{ lat: -13.25, lng: 34.30,  country: "Malawi",            countryCode: "mw", label: "🇲🇼 Malawi",            size: 0.5, color: "#6366F1" },
{ lat: -13.13, lng: 27.85,  country: "Zambia",            countryCode: "zm", label: "🇿🇲 Zambia",            size: 0.5, color: "#F59E0B" },
{ lat: -19.02, lng: 29.15,  country: "Zimbabwe",          countryCode: "zw", label: "🇿🇼 Zimbabwe",          size: 0.5, color: "#EC4899" },
{ lat: -18.77, lng: 46.87,  country: "Madagascar",        countryCode: "mg", label: "🇲🇬 Madagascar",        size: 0.5, color: "#14B8A6" },
{ lat: -22.33, lng: 24.68,  country: "Botswana",          countryCode: "bw", label: "🇧🇼 Botswana",          size: 0.5, color: "#8B5CF6" },
{ lat: 9.54,   lng: 38.00,  country: "Ethiopia",          countryCode: "et", label: "🇪🇹 Ethiopia",          size: 0.5, color: "#22C55E" },
{ lat: 5.15,   lng: 46.20,  country: "Somalia",           countryCode: "so", label: "🇸🇴 Somalia",           size: 0.5, color: "#06B6D4" },
{ lat: 12.86,  lng: 30.22,  country: "Sudan",             countryCode: "sd", label: "🇸🇩 Sudan",             size: 0.5, color: "#F43F5E" },
{ lat: 15.55,  lng: 32.53,  country: "Sudan",             countryCode: "sd", label: "🇸🇩 Sudan",             size: 0.5, color: "#F43F5E" },
{ lat: 17.23,  lng: -3.55,  country: "Mali",              countryCode: "ml", label: "🇲🇱 Mali",              size: 0.5, color: "#A3E635" },
{ lat: 17.61,  lng: 8.08,   country: "Niger",             countryCode: "ne", label: "🇳🇪 Niger",             size: 0.5, color: "#FB923C" },
{ lat: 12.36,  lng: 15.45,  country: "Chad",              countryCode: "td", label: "🇹🇩 Chad",              size: 0.5, color: "#60A5FA" },
{ lat: 7.54,   lng: -5.55,  country: "Ivory Coast",       countryCode: "ci", label: "🇨🇮 Ivory Coast",       size: 0.5, color: "#34D399" },
{ lat: 11.74,  lng: -15.73, country: "Guinea-Bissau",     countryCode: "gw", label: "🇬🇼 Guinea-Bissau",     size: 0.5, color: "#A78BFA" },
{ lat: 11.34,  lng: -11.76, country: "Guinea",            countryCode: "gn", label: "🇬🇳 Guinea",            size: 0.5, color: "#FCD34D" },
{ lat: 8.46,   lng: -13.23, country: "Sierra Leone",      countryCode: "sl", label: "🇸🇱 Sierra Leone",      size: 0.5, color: "#67E8F9" },
{ lat: 6.43,   lng: -9.43,  country: "Liberia",           countryCode: "lr", label: "🇱🇷 Liberia",           size: 0.5, color: "#F9A8D4" },
{ lat: 8.00,   lng: 1.16,   country: "Togo",              countryCode: "tg", label: "🇹🇬 Togo",              size: 0.5, color: "#86EFAC" },
{ lat: 9.31,   lng: 2.32,   country: "Benin",             countryCode: "bj", label: "🇧🇯 Benin",             size: 0.5, color: "#FCA5A5" },
{ lat: 12.36,  lng: -1.56,  country: "Burkina Faso",      countryCode: "bf", label: "🇧🇫 Burkina Faso",      size: 0.5, color: "#C4B5FD" },
{ lat: 15.45,  lng: 18.73,  country: "Libya",             countryCode: "ly", label: "🇱🇾 Libya",             size: 0.5, color: "#FDE68A" },
{ lat: 28.03,  lng: 1.66,   country: "Algeria",           countryCode: "dz", label: "🇩🇿 Algeria",           size: 0.5, color: "#6EE7B7" },
{ lat: 31.79,  lng: -7.09,  country: "Morocco",           countryCode: "ma", label: "🇲🇦 Morocco",           size: 0.5, color: "#FCA5A5" },
{ lat: 33.89,  lng: 9.54,   country: "Tunisia",           countryCode: "tn", label: "🇹🇳 Tunisia",           size: 0.5, color: "#93C5FD" },
{ lat: -8.84,  lng: 13.23,  country: "Angola",            countryCode: "ao", label: "🇦🇴 Angola",            size: 0.5, color: "#F472B6" },
{ lat: 3.86,   lng: 11.52,  country: "Cameroon",          countryCode: "cm", label: "🇨🇲 Cameroon",          size: 0.5, color: "#34D399" },
{ lat: -0.23,  lng: 15.83,  country: "Congo",             countryCode: "cg", label: "🇨🇬 Congo",             size: 0.5, color: "#FDBA74" },
{ lat: -4.04,  lng: 21.76,  country: "DR Congo",          countryCode: "cd", label: "🇨🇩 DR Congo",          size: 0.5, color: "#A5B4FC" },
{ lat: -3.37,  lng: 29.92,  country: "Burundi",           countryCode: "bi", label: "🇧🇮 Burundi",           size: 0.5, color: "#FCD34D" },
{ lat: -11.20, lng: 17.87,  country: "Angola",            countryCode: "ao", label: "🇦🇴 Angola",            size: 0.5, color: "#F472B6" },
{ lat: -29.61, lng: 28.23,  country: "Lesotho",           countryCode: "ls", label: "🇱🇸 Lesotho",           size: 0.5, color: "#67E8F9" },
{ lat: -26.52, lng: 31.47,  country: "Eswatini",          countryCode: "sz", label: "🇸🇿 Eswatini",          size: 0.5, color: "#86EFAC" },
{ lat: -17.71, lng: 31.05,  country: "Mozambique",        countryCode: "mz", label: "🇲🇿 Mozambique",        size: 0.5, color: "#FCA5A5" },
{ lat: -22.96, lng: 18.49,  country: "Namibia",           countryCode: "na", label: "🇳🇦 Namibia",           size: 0.5, color: "#C4B5FD" },
{ lat: 4.17,   lng: 9.80,   country: "Equatorial Guinea", countryCode: "gq", label: "🇬🇶 Equatorial Guinea", size: 0.5, color: "#FDE68A" },
{ lat: 0.41,   lng: 9.76,   country: "Gabon",             countryCode: "ga", label: "🇬🇦 Gabon",             size: 0.5, color: "#6EE7B7" },
{ lat: 6.61,   lng: 20.94,  country: "Central Africa",    countryCode: "cf", label: "🇨🇫 Central Africa",    size: 0.5, color: "#FDBA74" },
{ lat: 10.45,  lng: 51.21,  country: "Djibouti",          countryCode: "dj", label: "🇩🇯 Djibouti",          size: 0.5, color: "#93C5FD" },
{ lat: 15.18,  lng: 39.78,  country: "Eritrea",           countryCode: "er", label: "🇪🇷 Eritrea",           size: 0.5, color: "#F9A8D4" },
{ lat: -0.02,  lng: 37.91,  country: "Kenya",             countryCode: "ke", label: "🇰🇪 Kenya",             size: 0.5, color: "#4ADE80" },
{ lat: 5.86,   lng: -55.90, country: "Ghana",             countryCode: "gh", label: "🇬🇭 Ghana",             size: 0.5, color: "#FB7185" },
{ lat: 13.44,  lng: -15.31, country: "Gambia",            countryCode: "gm", label: "🇬🇲 Gambia",            size: 0.5, color: "#818CF8" },
{ lat: 14.69,  lng: -17.44, country: "Senegal",           countryCode: "sn", label: "🇸🇳 Senegal",           size: 0.5, color: "#2DD4BF" },
{ lat: 20.25,  lng: -10.94, country: "Mauritania",        countryCode: "mr", label: "🇲🇷 Mauritania",        size: 0.5, color: "#FCD34D" },
{ lat: 35.69,  lng: 139.69,  country: "Japan",          countryCode: "jp", label: "🇯🇵 Japan",          size: 0.5, color: "#EC4899" },
{ lat: 39.91,  lng: 116.39,  country: "China",          countryCode: "cn", label: "🇨🇳 China",          size: 0.5, color: "#10B981" },
{ lat: 28.61,  lng: 77.21,   country: "India",          countryCode: "in", label: "🇮🇳 India",          size: 0.5, color: "#F97316" },
{ lat: 33.69,  lng: 66.00,   country: "Afghanistan",    countryCode: "af", label: "🇦🇫 Afghanistan",    size: 0.5, color: "#84CC16" },
{ lat: 33.93,  lng: 67.71,   country: "Afghanistan",    countryCode: "af", label: "🇦🇫 Afghanistan",    size: 0.5, color: "#84CC16" },
{ lat: 30.38,  lng: 69.35,   country: "Pakistan",       countryCode: "pk", label: "🇵🇰 Pakistan",       size: 0.5, color: "#22C55E" },
{ lat: 23.69,  lng: 90.35,   country: "Bangladesh",     countryCode: "bd", label: "🇧🇩 Bangladesh",     size: 0.5, color: "#14B8A6" },
{ lat: 7.87,   lng: 80.77,   country: "Sri Lanka",      countryCode: "lk", label: "🇱🇰 Sri Lanka",      size: 0.5, color: "#F43F5E" },
{ lat: 27.91,  lng: 84.12,   country: "Nepal",          countryCode: "np", label: "🇳🇵 Nepal",          size: 0.5, color: "#EF4444" },
{ lat: 27.51,  lng: 90.43,   country: "Bhutan",         countryCode: "bt", label: "🇧🇹 Bhutan",         size: 0.5, color: "#F97316" },
{ lat: 17.56,  lng: 96.00,   country: "Myanmar",        countryCode: "mm", label: "🇲🇲 Myanmar",        size: 0.5, color: "#FBBF24" },
{ lat: 15.87,  lng: 100.99,  country: "Thailand",       countryCode: "th", label: "🇹🇭 Thailand",       size: 0.5, color: "#3B82F6" },
{ lat: 14.06,  lng: 108.28,  country: "Vietnam",        countryCode: "vn", label: "🇻🇳 Vietnam",        size: 0.5, color: "#EF4444" },
{ lat: 11.55,  lng: 104.92,  country: "Cambodia",       countryCode: "kh", label: "🇰🇭 Cambodia",       size: 0.5, color: "#F97316" },
{ lat: 17.96,  lng: 102.60,  country: "Laos",           countryCode: "la", label: "🇱🇦 Laos",           size: 0.5, color: "#EF4444" },
{ lat: 4.21,   lng: 101.98,  country: "Malaysia",       countryCode: "my", label: "🇲🇾 Malaysia",       size: 0.5, color: "#3B82F6" },
{ lat: 1.35,   lng: 103.82,  country: "Singapore",      countryCode: "sg", label: "🇸🇬 Singapore",      size: 0.5, color: "#EF4444" },
{ lat: -0.79,  lng: 113.92,  country: "Indonesia",      countryCode: "id", label: "🇮🇩 Indonesia",      size: 0.5, color: "#EF4444" },
{ lat: 12.88,  lng: 121.77,  country: "Philippines",    countryCode: "ph", label: "🇵🇭 Philippines",    size: 0.5, color: "#3B82F6" },
{ lat: 37.56,  lng: 126.98,  country: "South Korea",    countryCode: "kr", label: "🇰🇷 South Korea",    size: 0.5, color: "#3B82F6" },
{ lat: 40.00,  lng: 127.00,  country: "North Korea",    countryCode: "kp", label: "🇰🇵 North Korea",    size: 0.5, color: "#EF4444" },
{ lat: 47.89,  lng: 106.91,  country: "Mongolia",       countryCode: "mn", label: "🇲🇳 Mongolia",       size: 0.5, color: "#F97316" },
{ lat: 41.30,  lng: 69.24,   country: "Uzbekistan",     countryCode: "uz", label: "🇺🇿 Uzbekistan",     size: 0.5, color: "#22C55E" },
{ lat: 42.87,  lng: 74.60,   country: "Kyrgyzstan",     countryCode: "kg", label: "🇰🇬 Kyrgyzstan",     size: 0.5, color: "#EF4444" },
{ lat: 38.56,  lng: 68.77,   country: "Tajikistan",     countryCode: "tj", label: "🇹🇯 Tajikistan",     size: 0.5, color: "#3B82F6" },
{ lat: 40.51,  lng: 58.00,   country: "Turkmenistan",   countryCode: "tm", label: "🇹🇲 Turkmenistan",   size: 0.5, color: "#22C55E" },
{ lat: 51.18,  lng: 71.45,   country: "Kazakhstan",     countryCode: "kz", label: "🇰🇿 Kazakhstan",     size: 0.5, color: "#FCD34D" },
{ lat: 35.69,  lng: 51.39,   country: "Iran",           countryCode: "ir", label: "🇮🇷 Iran",           size: 0.5, color: "#22C55E" },
{ lat: 33.34,  lng: 44.40,   country: "Iraq",           countryCode: "iq", label: "🇮🇶 Iraq",           size: 0.5, color: "#EF4444" },
{ lat: 33.89,  lng: 35.50,   country: "Lebanon",        countryCode: "lb", label: "🇱🇧 Lebanon",        size: 0.5, color: "#EF4444" },
{ lat: 31.95,  lng: 35.93,   country: "Jordan",         countryCode: "jo", label: "🇯🇴 Jordan",         size: 0.5, color: "#F97316" },
{ lat: 24.69,  lng: 46.72,   country: "Saudi Arabia",   countryCode: "sa", label: "🇸🇦 Saudi Arabia",   size: 0.5, color: "#22C55E" },
{ lat: 15.55,  lng: 48.52,   country: "Yemen",          countryCode: "ye", label: "🇾🇪 Yemen",          size: 0.5, color: "#EF4444" },
{ lat: 21.00,  lng: 57.00,   country: "Oman",           countryCode: "om", label: "🇴🇲 Oman",           size: 0.5, color: "#22C55E" },
{ lat: 25.35,  lng: 51.18,   country: "Qatar",          countryCode: "qa", label: "🇶🇦 Qatar",          size: 0.5, color: "#8B0000" },
{ lat: 26.21,  lng: 50.59,   country: "Bahrain",        countryCode: "bh", label: "🇧🇭 Bahrain",        size: 0.5, color: "#EF4444" },
{ lat: 29.37,  lng: 47.98,   country: "Kuwait",         countryCode: "kw", label: "🇰🇼 Kuwait",         size: 0.5, color: "#22C55E" },
{ lat: 23.42,  lng: 53.85,   country: "UAE",            countryCode: "ae", label: "🇦🇪 UAE",            size: 0.5, color: "#A78BFA" },
{ lat: 34.80,  lng: 38.99,   country: "Syria",          countryCode: "sy", label: "🇸🇾 Syria",          size: 0.5, color: "#3B82F6" },
{ lat: 39.92,  lng: 32.85,   country: "Turkey",         countryCode: "tr", label: "🇹🇷 Turkey",         size: 0.5, color: "#EF4444" },
{ lat: 31.05,  lng: 34.85,   country: "Israel",         countryCode: "il", label: "🇮🇱 Israel",         size: 0.5, color: "#60A5FA" },
{ lat: 51.51,  lng: -0.13,   country: "United Kingdom", countryCode: "gb", label: "🇬🇧 UK",             size: 0.5, color: "#8B5CF6" },
{ lat: 52.52,  lng: 13.41,   country: "Germany",        countryCode: "de", label: "🇩🇪 Germany",        size: 0.5, color: "#F59E0B" },
{ lat: 48.86,  lng: 2.35,    country: "France",         countryCode: "fr", label: "🇫🇷 France",         size: 0.5, color: "#EF4444" },
{ lat: 40.42,  lng: -3.70,   country: "Spain",          countryCode: "es", label: "🇪🇸 Spain",          size: 0.5, color: "#F97316" },
{ lat: 41.90,  lng: 12.49,   country: "Italy",          countryCode: "it", label: "🇮🇹 Italy",          size: 0.5, color: "#22C55E" },
{ lat: 52.23,  lng: 21.01,   country: "Poland",         countryCode: "pl", label: "🇵🇱 Poland",         size: 0.5, color: "#EF4444" },
{ lat: 50.08,  lng: 14.44,   country: "Czech Republic", countryCode: "cz", label: "🇨🇿 Czech Republic", size: 0.5, color: "#3B82F6" },
{ lat: 47.81,  lng: 13.03,   country: "Austria",        countryCode: "at", label: "🇦🇹 Austria",        size: 0.5, color: "#EF4444" },
{ lat: 46.95,  lng: 7.45,    country: "Switzerland",    countryCode: "ch", label: "🇨🇭 Switzerland",    size: 0.5, color: "#F43F5E" },
{ lat: 50.85,  lng: 4.35,    country: "Belgium",        countryCode: "be", label: "🇧🇪 Belgium",        size: 0.5, color: "#FCD34D" },
{ lat: 52.37,  lng: 4.90,    country: "Netherlands",    countryCode: "nl", label: "🇳🇱 Netherlands",    size: 0.5, color: "#F97316" },
{ lat: 55.68,  lng: 12.57,   country: "Denmark",        countryCode: "dk", label: "🇩🇰 Denmark",        size: 0.5, color: "#EF4444" },
{ lat: 59.91,  lng: 10.75,   country: "Norway",         countryCode: "no", label: "🇳🇴 Norway",         size: 0.5, color: "#3B82F6" },
{ lat: 59.33,  lng: 18.07,   country: "Sweden",         countryCode: "se", label: "🇸🇪 Sweden",         size: 0.5, color: "#60A5FA" },
{ lat: 60.17,  lng: 24.94,   country: "Finland",        countryCode: "fi", label: "🇫🇮 Finland",        size: 0.5, color: "#34D399" },
{ lat: 64.14,  lng: -21.90,  country: "Iceland",        countryCode: "is", label: "🇮🇸 Iceland",        size: 0.5, color: "#A78BFA" },
{ lat: 38.72,  lng: -9.14,   country: "Portugal",       countryCode: "pt", label: "🇵🇹 Portugal",       size: 0.5, color: "#22C55E" },
{ lat: 37.98,  lng: 23.73,   country: "Greece",         countryCode: "gr", label: "🇬🇷 Greece",         size: 0.5, color: "#3B82F6" },
{ lat: 44.80,  lng: 20.46,   country: "Serbia",         countryCode: "rs", label: "🇷🇸 Serbia",         size: 0.5, color: "#EF4444" },
{ lat: 45.81,  lng: 15.98,   country: "Croatia",        countryCode: "hr", label: "🇭🇷 Croatia",        size: 0.5, color: "#F97316" },
{ lat: 47.50,  lng: 19.04,   country: "Hungary",        countryCode: "hu", label: "🇭🇺 Hungary",        size: 0.5, color: "#10B981" },
{ lat: 48.15,  lng: 17.11,   country: "Slovakia",       countryCode: "sk", label: "🇸🇰 Slovakia",       size: 0.5, color: "#6366F1" },
{ lat: 46.05,  lng: 14.51,   country: "Slovenia",       countryCode: "si", label: "🇸🇮 Slovenia",       size: 0.5, color: "#8B5CF6" },
{ lat: 42.70,  lng: 23.32,   country: "Bulgaria",       countryCode: "bg", label: "🇧🇬 Bulgaria",       size: 0.5, color: "#F59E0B" },
{ lat: 44.43,  lng: 26.11,   country: "Romania",        countryCode: "ro", label: "🇷🇴 Romania",        size: 0.5, color: "#EF4444" },
{ lat: 59.44,  lng: 24.75,   country: "Estonia",        countryCode: "ee", label: "🇪🇪 Estonia",        size: 0.5, color: "#3B82F6" },
{ lat: 56.95,  lng: 24.11,   country: "Latvia",         countryCode: "lv", label: "🇱🇻 Latvia",         size: 0.5, color: "#F43F5E" },
{ lat: 54.69,  lng: 25.28,   country: "Lithuania",      countryCode: "lt", label: "🇱🇹 Lithuania",      size: 0.5, color: "#FCD34D" },
{ lat: 53.90,  lng: 27.57,   country: "Belarus",        countryCode: "by", label: "🇧🇾 Belarus",        size: 0.5, color: "#34D399" },
{ lat: 50.45,  lng: 30.52,   country: "Ukraine",        countryCode: "ua", label: "🇺🇦 Ukraine",        size: 0.5, color: "#60A5FA" },
{ lat: 55.75,  lng: 37.62,   country: "Russia",         countryCode: "ru", label: "🇷🇺 Russia",         size: 0.5, color: "#F97316" },
{ lat: 41.33,  lng: 19.83,   country: "Albania",        countryCode: "al", label: "🇦🇱 Albania",        size: 0.5, color: "#EF4444" },
{ lat: 42.44,  lng: 19.26,   country: "Montenegro",     countryCode: "me", label: "🇲🇪 Montenegro",     size: 0.5, color: "#3B82F6" },
{ lat: 43.84,  lng: 18.36,   country: "Bosnia",         countryCode: "ba", label: "🇧🇦 Bosnia",         size: 0.5, color: "#22C55E" },
{ lat: 41.99,  lng: 21.43,   country: "North Macedonia",countryCode: "mk", label: "🇲🇰 North Macedonia",size: 0.5, color: "#F59E0B" },
{ lat: 42.67,  lng: 21.17,   country: "Kosovo",         countryCode: "xk", label: "🇽🇰 Kosovo",         size: 0.5, color: "#8B5CF6" },
{ lat: 47.00,  lng: 28.86,   country: "Moldova",        countryCode: "md", label: "🇲🇩 Moldova",        size: 0.5, color: "#F43F5E" },
{ lat: 42.00,  lng: 43.50,   country: "Georgia",        countryCode: "ge", label: "🇬🇪 Georgia",        size: 0.5, color: "#34D399" },
{ lat: 40.41,  lng: 49.87,   country: "Azerbaijan",     countryCode: "az", label: "🇦🇿 Azerbaijan",     size: 0.5, color: "#60A5FA" },
{ lat: 40.18,  lng: 44.51,   country: "Armenia",        countryCode: "am", label: "🇦🇲 Armenia",        size: 0.5, color: "#F97316" },
{ lat: 23.63,  lng: -102.55, country: "Mexico",               countryCode: "mx", label: "🇲🇽 Mexico",               size: 0.5, color: "#22C55E" },
{ lat: 15.78,  lng: -90.23,  country: "Guatemala",            countryCode: "gt", label: "🇬🇹 Guatemala",            size: 0.5, color: "#3B82F6" },
{ lat: 15.20,  lng: -86.24,  country: "Honduras",             countryCode: "hn", label: "🇭🇳 Honduras",             size: 0.5, color: "#3B82F6" },
{ lat: 13.79,  lng: -88.90,  country: "El Salvador",          countryCode: "sv", label: "🇸🇻 El Salvador",          size: 0.5, color: "#3B82F6" },
{ lat: 12.87,  lng: -85.21,  country: "Nicaragua",            countryCode: "ni", label: "🇳🇮 Nicaragua",            size: 0.5, color: "#22C55E" },
{ lat: 9.75,   lng: -83.75,  country: "Costa Rica",           countryCode: "cr", label: "🇨🇷 Costa Rica",           size: 0.5, color: "#EF4444" },
{ lat: 8.99,   lng: -79.52,  country: "Panama",               countryCode: "pa", label: "🇵🇦 Panama",               size: 0.5, color: "#EF4444" },
{ lat: 18.97,  lng: -72.29,  country: "Haiti",                countryCode: "ht", label: "🇭🇹 Haiti",                size: 0.5, color: "#F97316" },
{ lat: 18.74,  lng: -70.16,  country: "Dominican Republic",   countryCode: "do", label: "🇩🇴 Dominican Republic",   size: 0.5, color: "#3B82F6" },
{ lat: 21.52,  lng: -77.78,  country: "Cuba",                 countryCode: "cu", label: "🇨🇺 Cuba",                 size: 0.5, color: "#EF4444" },
{ lat: 18.11,  lng: -77.30,  country: "Jamaica",              countryCode: "jm", label: "🇯🇲 Jamaica",              size: 0.5, color: "#FCD34D" },
{ lat: 17.36,  lng: -62.78,  country: "Antigua and Barbuda",  countryCode: "ag", label: "🇦🇬 Antigua and Barbuda",  size: 0.5, color: "#3B82F6" },
{ lat: 13.16,  lng: -59.55,  country: "Barbados",             countryCode: "bb", label: "🇧🇧 Barbados",             size: 0.5, color: "#F97316" },
{ lat: 12.36,  lng: -61.67,  country: "Grenada",              countryCode: "gd", label: "🇬🇩 Grenada",              size: 0.5, color: "#22C55E" },
{ lat: 13.25,  lng: -61.20,  country: "Saint Vincent",        countryCode: "vc", label: "🇻🇨 Saint Vincent",        size: 0.5, color: "#22C55E" },
{ lat: 13.91,  lng: -60.98,  country: "Saint Lucia",          countryCode: "lc", label: "🇱🇨 Saint Lucia",          size: 0.5, color: "#3B82F6" },
{ lat: 15.30,  lng: -61.39,  country: "Dominica",             countryCode: "dm", label: "🇩🇲 Dominica",             size: 0.5, color: "#22C55E" },
{ lat: 17.12,  lng: -61.85,  country: "Antigua",              countryCode: "ag", label: "🇦🇬 Antigua",              size: 0.5, color: "#3B82F6" },
{ lat: 17.25,  lng: -62.68,  country: "Saint Kitts and Nevis",countryCode: "kn", label: "🇰🇳 Saint Kitts and Nevis",size: 0.5, color: "#22C55E" },
{ lat: 10.69,  lng: -61.22,  country: "Trinidad and Tobago",  countryCode: "tt", label: "🇹🇹 Trinidad and Tobago",  size: 0.5, color: "#EF4444" },
{ lat: 25.03,  lng: -77.40,  country: "Bahamas",              countryCode: "bs", label: "🇧🇸 Bahamas",              size: 0.5, color: "#3B82F6" },
{ lat: 19.30,  lng: -81.38,  country: "Cayman Islands",       countryCode: "ky", label: "🇰🇾 Cayman Islands",       size: 0.5, color: "#3B82F6" },
{ lat: -40.90, lng: 174.89,  country: "New Zealand",          countryCode: "nz", label: "🇳🇿 New Zealand",          size: 0.5, color: "#3B82F6" },
{ lat: -9.43,  lng: 160.03,  country: "Solomon Islands",      countryCode: "sb", label: "🇸🇧 Solomon Islands",      size: 0.5, color: "#22C55E" },
{ lat: -17.73, lng: 178.07,  country: "Fiji",                 countryCode: "fj", label: "🇫🇯 Fiji",                 size: 0.5, color: "#3B82F6" },
{ lat: -8.87,  lng: -121.02, country: "French Polynesia",     countryCode: "pf", label: "🇵🇫 French Polynesia",     size: 0.5, color: "#F97316" },
{ lat: -19.05, lng: 169.87,  country: "Vanuatu",              countryCode: "vu", label: "🇻🇺 Vanuatu",              size: 0.5, color: "#22C55E" },
{ lat: -13.76, lng: -172.10, country: "Samoa",                countryCode: "ws", label: "🇼🇸 Samoa",                size: 0.5, color: "#EF4444" },
{ lat: -8.52,  lng: 179.20,  country: "Tuvalu",               countryCode: "tv", label: "🇹🇻 Tuvalu",               size: 0.5, color: "#3B82F6" },
{ lat: -0.52,  lng: 166.93,  country: "Nauru",                countryCode: "nr", label: "🇳🇷 Nauru",                size: 0.5, color: "#3B82F6" },
{ lat: 7.13,   lng: 171.18,  country: "Marshall Islands",     countryCode: "mh", label: "🇲🇭 Marshall Islands",     size: 0.5, color: "#3B82F6" },
{ lat: 6.89,   lng: 158.21,  country: "Micronesia",           countryCode: "fm", label: "🇫🇲 Micronesia",           size: 0.5, color: "#3B82F6" },
{ lat: -21.13, lng: -175.20, country: "Tonga",                countryCode: "to", label: "🇹🇴 Tonga",                size: 0.5, color: "#EF4444" },
{ lat: -9.43,  lng: 147.18,  country: "Papua New Guinea",     countryCode: "pg", label: "🇵🇬 Papua New Guinea",     size: 0.5, color: "#F97316" },
{ lat: 7.51,   lng: 134.58,  country: "Palau",                countryCode: "pw", label: "🇵🇼 Palau",                size: 0.5, color: "#3B82F6" },
{ lat: -38.42, lng: -63.62,  country: "Argentina",  countryCode: "ar", label: "🇦🇷 Argentina",  size: 0.5, color: "#74C0FC" },
{ lat: -9.19,  lng: -75.02,  country: "Peru",       countryCode: "pe", label: "🇵🇪 Peru",       size: 0.5, color: "#F03E3E" },
{ lat: 4.57,   lng: -74.30,  country: "Colombia",   countryCode: "co", label: "🇨🇴 Colombia",   size: 0.5, color: "#FCC419" },
{ lat: -23.43, lng: -58.44,  country: "Paraguay",   countryCode: "py", label: "🇵🇾 Paraguay",   size: 0.5, color: "#94D82D" },
{ lat: -32.52, lng: -55.77,  country: "Uruguay",    countryCode: "uy", label: "🇺🇾 Uruguay",    size: 0.5, color: "#4DABF7" },
{ lat: -16.29, lng: -63.59,  country: "Bolivia",    countryCode: "bo", label: "🇧🇴 Bolivia",    size: 0.5, color: "#FF922B" },
{ lat: -35.68, lng: -71.54,  country: "Chile",      countryCode: "cl", label: "🇨🇱 Chile",      size: 0.5, color: "#F76707" },
{ lat: -1.83,  lng: -78.18,  country: "Ecuador",    countryCode: "ec", label: "🇪🇨 Ecuador",    size: 0.5, color: "#2F9E44" },
{ lat: 8.00,   lng: -66.59,  country: "Venezuela",  countryCode: "ve", label: "🇻🇪 Venezuela",  size: 0.5, color: "#E64980" },
{ lat: 4.86,   lng: -58.93,  country: "Guyana",     countryCode: "gy", label: "🇬🇾 Guyana",     size: 0.5, color: "#862E9C" },
{ lat: 3.92,   lng: -56.03,  country: "Suriname",   countryCode: "sr", label: "🇸🇷 Suriname",   size: 0.5, color: "#1971C2" },
  
 

];

// Detect if user is on mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return isMobile;
}

export default function App() {
  const { articles, loading, error, fetchNewsByCountry } = useFetchNews();
  const isMobile = useIsMobile();

  const [activeCountryCode, setActiveCountryCode] = useState<string | null>(null);
  const [activeCountryName, setActiveCountryName] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  const mainRef = useRef<HTMLDivElement>(null);
  const [globeSize, setGlobeSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!mainRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setGlobeSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    observer.observe(mainRef.current);
    return () => observer.disconnect();
  }, []);

  const handleMarkerClick = useCallback((marker: GlobeMarker) => {
    setActiveCountryCode(marker.countryCode);
    setActiveCountryName(marker.country);
    setSelectedArticle(null);
    fetchNewsByCountry(marker.countryCode);

    if (isMobile) {
      setIsBottomSheetOpen(true);  // ← open bottom sheet on mobile
    } else {
      setIsSidebarOpen(true);      // ← open sidebar on desktop
    }
  }, [fetchNewsByCountry, isMobile]);

  const handleArticleClick = useCallback((article: NewsArticle) => {
    setSelectedArticle(article);
  }, []);

  const handleCardClose = useCallback(() => {
    setSelectedArticle(null);
  }, []);

  const sidebarProp = {
    variant: 'static' as const,
    isOpen: isSidebarOpen,
    onToggle: () => setIsSidebarOpen(prev => !prev),
    side: 'left' as const,
    loading,
    error,
    markers: MARKERS,
    countryName: activeCountryName,
    onCountrySearch: (countryCode: string) => {
      setActiveCountryCode(countryCode);
      setSelectedArticle(null);
      fetchNewsByCountry(countryCode);
    },
    items: articles.map(article => ({
      article_id: article.article_id,
      title: article.title,
      countryCode: activeCountryCode ?? '',
      onClick: () => handleArticleClick(article),
    })),
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', background: '#000' }}>

      {/* Sidebar — desktop only */}
      {!isMobile && (
        <div style={{ flexShrink: 0 }}>
          <Sidebar sidebar={sidebarProp} />
        </div>
      )}

      {/* Globe — full screen on mobile, fills rest on desktop */}
      <main
        ref={mainRef}
        style={{ flex: 1, position: 'relative', overflow: 'hidden', minWidth: 0,alignItems: isMobile ? 'center' : 'center',
    justifyContent: isMobile ? 'center' : 'center', }}
      >
        {globeSize.width > 0 && (
          <GlobeComponent
            markers={MARKERS}
            onMarkerClick={handleMarkerClick}
            activeCountryCode={activeCountryCode ?? undefined}
            height={isMobile ? window.innerHeight : globeSize.height}
            width={isMobile ? window.innerWidth : globeSize.width}
            showLabels={isMobile}  // ← pass this to show country names on mobile
          />
        )}

 {isMobile && (
    <GlobeOverlay
      markers={MARKERS}
      onCountrySearch={(countryCode) => {
        setActiveCountryCode(countryCode);
        setSelectedArticle(null);
        fetchNewsByCountry(countryCode);
        
      }}
    />
  )}
        {/* News card overlay */}
       {/* News card — desktop only, mobile handles it inside BottomSheet */}
{selectedArticle && !isMobile && (
  <div style={{
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0,0,0,0.5)',
    zIndex: 100,
  }}>
    <NewsCard
      card={{
        title: selectedArticle.title,
        description: selectedArticle.description,
        onClose: handleCardClose,
      }}
    />
  </div>
)}
      </main>

      {/* Bottom sheet — mobile only */}
      {isMobile && (
        <BottomSheet
          isOpen={isBottomSheetOpen}
          onClose={() => setIsBottomSheetOpen(false)}
          countryName={activeCountryName}
          loading={loading}
          error={error}
          items={articles.map(article => ({
            article_id: article.article_id,
            title: article.title,
            description: article.description,
            onClick: () => handleArticleClick(article),
          }))}
        />
      )}

    </div>
  );
}