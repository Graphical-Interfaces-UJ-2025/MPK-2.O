# MPK 2.O

**Yaroslav Kobryn, Maksymilian Pająk, Yevhen Kotliarchuk**

**Sprawozdanie #5**

---

## Instrukcja dla testerów

### Informacje wstępne

Aplikacja MPK 2.0 to system zarządzania komunikacją miejską, który umożliwia:
- Przeglądanie linii tramwajowych i autobusowych
- Przeglądanie przystanków
- Planowanie podróży
- Zakup biletów (po zalogowaniu)
- Doładowanie konta (po zalogowaniu)
- Przeglądanie historii zamówień i doładowań (po zalogowaniu)

## Scenariusze testowe

### Scenariusz 1: Rejestracja nowego użytkownika

**Cel:** Sprawdzenie procesu tworzenia nowego konta w systemie.

**Kroki do wykonania:**
1. Otwórz stronę główną aplikacji
2. Kliknij przycisk "Zaloguj się" w prawym górnym rogu
3. Na stronie logowania kliknij link "Zarejestruj się"
4. Wypełnij formularz rejestracji:
   - Imię
   - Nazwisko
   - Email
   - PESEL (11 cyfr)
   - Hasło (minimum 6 znaków)
5. Kliknij przycisk "Zarejestruj się"

**Oczekiwany rezultat:**
- Użytkownik zostaje zarejestrowany i automatycznie zalogowany
- Przekierowanie do strony z biletami
- W prawym górnym rogu widoczne imię i nazwisko użytkownika

---

### Scenariusz 2: Logowanie do systemu

**Cel:** Sprawdzenie procesu logowania istniejącego użytkownika.

**Kroki do wykonania:**
1. Otwórz stronę główną aplikacji
2. Kliknij przycisk "Zaloguj się" w prawym górnym rogu
3. Wprowadź email i hasło
4. Kliknij przycisk "Zaloguj się"

**Oczekiwany rezultat:**
- Użytkownik zostaje zalogowany
- W prawym górnym rogu widoczne imię i nazwisko użytkownika oraz saldo konta

---

### Scenariusz 3: Przeglądanie linii komunikacyjnych

**Cel:** Sprawdzenie funkcjonalności przeglądania dostępnych linii.

**Kroki do wykonania:**
1. Kliknij "LINIE" w menu nawigacyjnym
2. Przejrzyj listę dostępnych tramwajów i autobusów
3. Użyj pola wyszukiwania, aby znaleźć konkretną linię
4. Kliknij na wybraną linię, aby zobaczyć szczegóły

**Oczekiwany rezultat:**
- Wyświetlenie listy linii tramwajowych i autobusowych
- Filtrowanie działa poprawnie
- Po kliknięciu na linię wyświetlają się szczegóły trasy

---

### Scenariusz 4: Przeglądanie przystanków

**Cel:** Sprawdzenie funkcjonalności przeglądania przystanków.

**Kroki do wykonania:**
1. Kliknij "PRZYSTANKI" w menu nawigacyjnym
2. Przejrzyj listę dostępnych przystanków
3. Użyj pola wyszukiwania, aby znaleźć konkretny przystanek
4. Kliknij "Rozkład jazdy" przy wybranym przystanku

**Oczekiwany rezultat:**
- Wyświetlenie listy wszystkich przystanków
- Widoczne są linie obsługujące każdy przystanek
- Wyszukiwanie działa poprawnie

---

### Scenariusz 5: Planowanie podróży

**Cel:** Sprawdzenie funkcjonalności planera podróży.

**Kroki do wykonania:**
1. Kliknij "PLANER PODRÓŻY" w menu nawigacyjnym
2. Wybierz przystanek początkowy z listy "Skąd"
3. Wybierz przystanek docelowy z listy "Dokąd"
4. Ustaw godzinę odjazdu
5. Kliknij "Szukaj połączenia"

**Oczekiwany rezultat:**
- Wyświetlenie listy dostępnych połączeń
- Dla każdego połączenia widoczny czas podróży i liczba przesiadek
- Możliwość wyboru trasy

---

### Scenariusz 6: Zakup biletu

**Cel:** Sprawdzenie procesu zakupu biletu (wymaga zalogowania).

**Kroki do wykonania:**
1. Zaloguj się do systemu
2. Kliknij "BILETY" w menu nawigacyjnym
3. Wybierz rodzaj biletu (24-godzinny, 7-dniowy lub miesięczny)
4. Wybierz datę rozpoczęcia ważności biletu
5. Kliknij "Kup bilet"

**Oczekiwany rezultat:**
- Bilet zostaje zakupiony
- Saldo konta zostaje pomniejszone o cenę biletu
- Bilet pojawia się w historii zamówień

---

### Scenariusz 7: Doładowanie konta

**Cel:** Sprawdzenie procesu doładowania salda konta (wymaga zalogowania).

**Kroki do wykonania:**
1. Zaloguj się do systemu
2. Kliknij na swoje imię w prawym górnym rogu
3. Wybierz "Doładuj konto" z menu
4. Wybierz kwotę doładowania (50, 100, 200 lub 500 PLN) lub wpisz własną
5. Kliknij "Doładuj konto"

**Oczekiwany rezultat:**
- Saldo konta zostaje zwiększone o wybraną kwotę
- Transakcja pojawia się w historii doładowań

---

### Scenariusz 8: Przeglądanie profilu i historii

**Cel:** Sprawdzenie dostępu do danych użytkownika (wymaga zalogowania).

**Kroki do wykonania:**
1. Zaloguj się do systemu
2. Kliknij na swoje imię w prawym górnym rogu
3. Wybierz "Profil" - sprawdź dane osobowe
4. Wybierz "Historia zamówień" - sprawdź zakupione bilety
5. Wybierz "Historia doładowań" - sprawdź doładowania konta

**Oczekiwany rezultat:**
- Profil wyświetla: imię, nazwisko, PESEL (zamaskowany), saldo
- Historia zamówień pokazuje zakupione bilety ze statusem
- Historia doładowań pokazuje wszystkie transakcje doładowań

---

**Uwagi i sugestie:**

1. **Strona zakupu biletów - szybki dostęp do historii**
   > "Dodajcie szybki link do historii zamówień lub jeszcze lepiej, pokażcie ostatnie 3-5 kupionych biletów bezpośrednio na tej stronie. Często kupuję ten sam rodzaj biletu i chcę szybko zweryfikować poprzednie zakupy bez opuszczania strony."

2. **Planer podróży - potrzeba autouzupełniania i przycisku zamiany**
   > "Wybór przystanku MUSI być rozwijaną listą z wyszukiwaniem i autouzupełnianiem! Przy dziesiątkach przystanków używanie zwykłej listy rozwijanej jest frustrujące. Dodajcie też przycisk 'zamień' między miejscem początkowym a docelowym dla podróży powrotnych."

3. **Historia doładowań - więcej szczegółów**
   > "Strona doładowań powinna wyświetlać historię transakcji pod formularzem. Pokażcie przynajmniej ostatnie 5-10 doładowań z: datą, kwotą, metodą płatności i statusem. To buduje zaufanie i pomaga użytkownikom śledzić wydatki."

4. **Ogólne sugestie UX**
   > "Rozważcie dodanie skrótów klawiszowych dla zaawansowanych użytkowników i może funkcję 'ulubione przystanki' w planerze podróży."

---
