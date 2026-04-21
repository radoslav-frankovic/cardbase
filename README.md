# Cardbase

Angular aplikacia na evidovanie sportovych zberatelskych kariet SportZoo.

## Stav

- Angular CLI 21.1.4
- Predvyplnene kolekcie SportZoo
- Tipsport liga 2025/26: checklisty TEL1 a TEL2 predvyplnene z oficialnych SportZoo PDF
- Tipsport liga 2025/26: 1. seria ma 435 kariet napriec setmi, 2. seria ma 387 kariet napriec setmi
- Hokejove Slovensko 2026: pripraveny placeholder checklist `001-180`
- Ukladanie evidencie do `localStorage`
- Evidencia vlastnictva, poctu kusov, poznamok a fotiek
- Filtrovanie podla serie, setu, textu, vlastnictva a fotiek
- Import checklistu zo skopirovaneho textu alebo CSV riadkov

## SportZoo zdroje

Aplikacia obsahuje priame odkazy na oficialne SportZoo produktove stranky a checklist PDF:

- `TEL1 CHECKLIST.pdf`
- `TEL2 CHECKLIST.pdf`
- `TL_25-26_S1_puzzle_quest.pdf`
- `TL_25-26_S2_puzzle_quest.pdf`

Prehliadac moze blokovat automaticke citanie suborov z cudzej domeny cez CORS. Preto aktualna verzia poskytuje odkazy na oficialne PDF a import textu/CSV po skopirovani z checklistu.

Hokejove Slovensko 2026 je na SportZoo zatial uvedene ako planovana kolekcia bez verejneho checklist PDF. Aplikacia preto obsahuje pripraveny ciselny checklist, ktory sa da neskor prepisat importom, ked SportZoo zverejni mena a sety.

Podporovany import:

```text
001; Patrik Jurcak; HC Kosice; Zakladny set
002; Meno Hraca; Klub; Zakladny set
```

## Spustenie

```bash
npm start
```

Aplikacia bezi na `http://localhost:4200/`.

## Build

```bash
npm run build
```
