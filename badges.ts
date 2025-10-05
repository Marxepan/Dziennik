export interface Badge {
  days: number;
  name: string;
  icon: string;
  description: string;
}

export const badges: Badge[] = [
  { days: 1, name: "Pierwszy Krok", icon: "fa-shoe-prints", description: "Zaczynasz podróż. Gratulacje!" },
  { days: 3, name: "Młody Pąk", icon: "fa-seedling", description: "Trzy dni to solidny fundament." },
  { days: 7, name: "Wojownik Tygodnia", icon: "fa-shield-halved", description: "Cały tydzień czystości! Jesteś silny." },
  { days: 14, name: "Dwa Tygodnie Wytrwałości", icon: "fa-calendar-check", description: "Konsekwencja przynosi efekty." },
  { days: 21, name: "Siła Nawyków", icon: "fa-link", description: "Budujesz nowe, zdrowe ścieżki w swoim umyśle." },
  { days: 30, name: "Miesięczny Kamień Milowy", icon: "fa-monument", description: "Cały miesiąc! To ogromny sukces." },
  { days: 45, name: "Silne Konary", icon: "fa-mountain", description: "Twoje drzewo jest coraz silniejsze i odporne na wiatr." },
  { days: 60, name: "Siła Dwóch Miesięcy", icon: "fa-gem", description: "Twoja determinacja jest inspirująca." },
  { days: 90, name: "Spartanin", icon: "fa-helmet-safety", description: "90 dni to legendarny wynik. Nowe nawyki są już częścią Ciebie." },
  { days: 120, name: "Kwitnące Drzewo", icon: "fa-spa", description: "Twoje wysiłki rozkwitają. Piękno wolności jest widoczne." },
  { days: 180, name: "Pół Roku Wolności", icon: "fa-flag-checkered", description: "Jesteś na prostej drodze do trwałej zmiany." },
  { days: 270, name: "Owoce Zwycięstwa", icon: "fa-apple-whole", description: "Zbierasz owoce swojej ciężkiej pracy. Smakują jak wolność." },
  { days: 365, name: "Mistrz Roku", icon: "fa-crown", description: "Cały rok! Jesteś legendą i inspiracją dla innych." },
  { days: 500, name: "Strażnik Wolności", icon: "fa-shield-heart", description: "Twoje drzewo stało się częścią lasu. Jesteś strażnikiem swojej wolności." },
];
