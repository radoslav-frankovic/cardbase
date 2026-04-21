import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SPORTZOO_CHECKLIST_CARDS } from './checklists';

export type SeriesId = 'tipsport-s1' | 'tipsport-s2' | 'hokejove-slovensko-2026';
type OwnershipFilter = 'all' | 'owned' | 'missing' | 'withPhoto';

interface CollectionSeries {
  id: SeriesId;
  title: string;
  release: string;
  sourceProductUrl: string;
  checklistPdfUrl: string;
  puzzlePdfUrl: string;
  description: string;
}

export interface CardRecord {
  id: string;
  number: string;
  seriesId: SeriesId;
  subset: string;
  subsetOrder?: number;
  player: string;
  team: string;
  owned: boolean;
  quantity: number;
  notes: string;
  signatureCode?: string;
  photo?: string;
}

const STORAGE_KEY = 'cardbase:sportzoo-tipsport-2025-26';

const SERIES: CollectionSeries[] = [
  {
    id: 'tipsport-s1',
    title: 'Tipsport liga 2025/26 - 1. seria',
    release: 'November 2025',
    sourceProductUrl:
      'https://www.sportzoo.store/p/hobby-box-hokejove-karticky-sportzoo-tipsport-liga-2025-26-1-seria',
    checklistPdfUrl: 'https://sportzoo.s15.cdn-upgates.com/s/s6931a7d24f1b3-tel1-checklist.pdf',
    puzzlePdfUrl: 'https://sportzoo.s15.cdn-upgates.com/1/16913140683637-tl-25-26-s1-puzzle-quest.pdf',
    description:
      'Oficialny checklist TEL1 je nacitany vratane zakladneho setu, insertov, podpisoviek a memorabilia.',
  },
  {
    id: 'tipsport-s2',
    title: 'Tipsport liga 2025/26 - 2. seria',
    release: 'Februar 2026',
    sourceProductUrl:
      'https://www.sportzoo.store/p/startovaci-balicek-hokejove-karticky-sportzoo-tipsport-liga-2025-26-2-seria',
    checklistPdfUrl: 'https://sportzoo.s15.cdn-upgates.com/z/z699d9399d42d3-tel2-checklist.pdf',
    puzzlePdfUrl: 'https://sportzoo.s15.cdn-upgates.com/0/06989db60dfcec-tl-25-26-s2-puzzle-quest.pdf',
    description:
      'Oficialny checklist TEL2 je nacitany vratane zakladneho setu, insertov, podpisoviek a memorabilia.',
  },
  {
    id: 'hokejove-slovensko-2026',
    title: 'Hokejove Slovensko 2026',
    release: '2026',
    sourceProductUrl: 'https://sportzoo.sk/kolekcie',
    checklistPdfUrl: '',
    puzzlePdfUrl: '',
    description:
      'SportZoo aktualne uvadza kolekciu Hokejove Slovensko 2026 ako planovanu. Verejny checklist zatial nie je zverejneny; po vydani ho vloz cez import alebo dopln PDF odkaz.',
  },
];

const SUBSETS_HOKEJOVE_SLOVENSKO_2026 = [
  'Zakladny set',
  'Brankari',
  'Legendy',
  'Talenty',
  'Reprezentacia',
  'Podpisy',
  'Memorabilia',
];

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly series = SERIES;
  readonly selectedSeriesId = signal<SeriesId>('tipsport-s1');
  readonly search = signal('');
  readonly ownershipFilter = signal<OwnershipFilter>('all');
  readonly selectedCardId = signal<string | null>(null);
  readonly importText = signal('');
  readonly cards = signal<CardRecord[]>(this.loadCards());
  readonly selectedSubset = signal(this.firstSubsetForSeries('tipsport-s1'));

  readonly selectedSeries = computed(
    () => this.series.find((series) => series.id === this.selectedSeriesId()) ?? this.series[0],
  );

  readonly visibleCards = computed(() => {
    const query = this.normalize(this.search());
    const selectedSeriesId = this.selectedSeriesId();
    const selectedSubset = this.selectedSubset();
    const ownershipFilter = this.ownershipFilter();

    return this.cards().filter((card) => {
      const matchesSeries = card.seriesId === selectedSeriesId;
      const matchesSubset = card.subset === selectedSubset;
      const haystack = this.normalize(`${card.number} ${card.player} ${card.team} ${card.subset}`);
      const matchesSearch = !query || haystack.includes(query);
      const matchesOwnership =
        ownershipFilter === 'all' ||
        (ownershipFilter === 'owned' && card.owned) ||
        (ownershipFilter === 'missing' && !card.owned) ||
        (ownershipFilter === 'withPhoto' && Boolean(card.photo));

      return matchesSeries && matchesSubset && matchesSearch && matchesOwnership;
    });
  });

  readonly selectedCard = computed(() => {
    const selectedCardId = this.selectedCardId();
    return this.cards().find((card) => card.id === selectedCardId) ?? this.visibleCards()[0] ?? null;
  });

  readonly activeSubsets = computed(() => {
    const subsets = new Map<string, number>();

    for (const card of this.cards().filter((card) => card.seriesId === this.selectedSeriesId())) {
      const current = subsets.get(card.subset);
      const order = card.subsetOrder ?? 999;
      subsets.set(card.subset, current === undefined ? order : Math.min(current, order));
    }

    return Array.from(subsets.entries())
      .sort(([leftSubset, leftOrder], [rightSubset, rightOrder]) => leftOrder - rightOrder || leftSubset.localeCompare(rightSubset))
      .map(([subset]) => subset);
  });

  readonly stats = computed(() => {
    const cards = this.cards().filter(
      (card) => card.seriesId === this.selectedSeriesId() && card.subset === this.selectedSubset(),
    );
    const owned = cards.filter((card) => card.owned).length;
    const withPhoto = cards.filter((card) => card.photo).length;
    const completion = cards.length === 0 ? 0 : Math.round((owned / cards.length) * 100);

    return { total: cards.length, owned, missing: cards.length - owned, withPhoto, completion };
  });

  selectSeries(seriesId: SeriesId): void {
    this.selectedSeriesId.set(seriesId);
    this.selectedSubset.set(this.firstSubsetForSeries(seriesId));
    this.selectedCardId.set(null);
  }

  selectSubset(subset: string): void {
    this.selectedSubset.set(subset);
    this.selectedCardId.set(null);
  }

  selectCard(card: CardRecord): void {
    this.selectedCardId.set(card.id);
  }

  updateCard(cardId: string, patch: Partial<CardRecord>): void {
    this.cards.update((cards) =>
      cards.map((card) => {
        if (card.id !== cardId) {
          return card;
        }

        const next = { ...card, ...patch };
        if (patch.owned === true && next.quantity < 1) {
          next.quantity = 1;
        }
        if (patch.quantity !== undefined) {
          next.quantity = Math.max(0, Math.floor(Number(patch.quantity) || 0));
          next.owned = next.quantity > 0;
        }

        return next;
      }),
    );
    this.persist();
  }

  importChecklist(): void {
    const rows = this.parseChecklist(this.importText(), this.selectedSeriesId());
    if (rows.length === 0) {
      return;
    }

    this.cards.update((cards) => {
      const byNumber = new Map(cards.map((card) => [`${card.seriesId}:${card.number}`, card]));
      for (const row of rows) {
        const key = `${row.seriesId}:${row.number}`;
        const existing = byNumber.get(key);
        byNumber.set(key, existing ? { ...existing, ...row } : row);
      }
      return Array.from(byNumber.values()).sort((left, right) => Number(left.number) - Number(right.number));
    });
    this.importText.set('');
    this.persist();
  }

  resetDemoData(): void {
    this.cards.set(createSeedCards());
    this.selectedCardId.set(null);
    this.persist();
  }

  attachPhoto(cardId: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.updateCard(cardId, { photo: String(reader.result) });
      input.value = '';
    };
    reader.readAsDataURL(file);
  }

  removePhoto(cardId: string): void {
    this.updateCard(cardId, { photo: undefined });
  }

  hasChecklistPdf(): boolean {
    return Boolean(this.selectedSeries().checklistPdfUrl);
  }

  hasPuzzlePdf(): boolean {
    return Boolean(this.selectedSeries().puzzlePdfUrl);
  }

  private parseChecklist(text: string, seriesId: SeriesId): CardRecord[] {
    const fallbackSubset = 'Zakladny set';

    return text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line): CardRecord | null => {
        const parts = line.split(/[;\t]/).map((part) => part.trim());
        const csvLike = parts.length >= 2 && isCardCode(parts[0]);
        const match = line.match(/^#?(\d{1,3}|[A-Z0-9]{2,4}-[A-Z0-9]{1,4})\s+(.+?)(?:\s{2,}|\s+-\s+|\t)(.+)?$/);
        const number = csvLike ? parts[0] : match?.[1];
        const player = csvLike ? parts[1] : match?.[2];
        const team = csvLike ? (parts[2] ?? '') : (match?.[3] ?? '');
        const subset = csvLike ? (parts[3] ?? fallbackSubset) : fallbackSubset;

        if (!number || !player) {
          return null;
        }

        return {
          id: `${seriesId}-${formatCardCode(number).toLowerCase()}`,
          number: formatCardCode(number),
          seriesId,
          subset,
          subsetOrder: this.activeSubsets().indexOf(subset),
          player,
          team,
          owned: false,
          quantity: 0,
          notes: '',
        };
      })
      .filter((card): card is CardRecord => Boolean(card));
  }

  private loadCards(): CardRecord[] {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return createSeedCards();
    }

    try {
      return mergeWithSeedCards(JSON.parse(stored) as CardRecord[]);
    } catch {
      return createSeedCards();
    }
  }

  private persist(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.cards()));
  }

  private normalize(value: string): string {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '');
  }

  private firstSubsetForSeries(seriesId: SeriesId): string {
    const cards = this.cards ? this.cards() : createSeedCards();
    return (
      cards
        .filter((card) => card.seriesId === seriesId)
        .sort((left, right) => (left.subsetOrder ?? 999) - (right.subsetOrder ?? 999))[0]?.subset ??
      'Zakladny set'
    );
  }
}

function createSeedCards(): CardRecord[] {
  return [
    ...SPORTZOO_CHECKLIST_CARDS,
    ...createNumberedCards(
      'hokejove-slovensko-2026',
      1,
      180,
      SUBSETS_HOKEJOVE_SLOVENSKO_2026,
    ),
  ];
}

function mergeWithSeedCards(storedCards: CardRecord[]): CardRecord[] {
  const normalizedStoredCards = storedCards.map(normalizeStoredCard);
  const storedById = new Map(normalizedStoredCards.map((card) => [card.id, card]));

  for (const seedCard of createSeedCards()) {
    const storedCard = storedById.get(seedCard.id);
    if (storedCard) {
      storedById.set(seedCard.id, {
        ...seedCard,
        owned: storedCard.owned,
        quantity: storedCard.quantity,
        notes: storedCard.notes,
        photo: storedCard.photo,
      });
    } else {
      storedById.set(seedCard.id, seedCard);
    }
  }

  return Array.from(storedById.values()).sort((left, right) => {
    const seriesOrder = SERIES.findIndex((series) => series.id === left.seriesId) -
      SERIES.findIndex((series) => series.id === right.seriesId);
    const subsetOrder = (left.subsetOrder ?? 999) - (right.subsetOrder ?? 999);

    return seriesOrder || subsetOrder || left.number.localeCompare(right.number, undefined, { numeric: true });
  });
}

function normalizeStoredCard(card: CardRecord): CardRecord {
  const legacySeriesIds: Record<string, SeriesId> = {
    s1: 'tipsport-s1',
    s2: 'tipsport-s2',
  };
  const seriesId = legacySeriesIds[card.seriesId] ?? card.seriesId;
  const number = formatCardCode(card.number);

  return {
    ...card,
    id: `${seriesId}-${number.toLowerCase()}`,
    number,
    seriesId,
  };
}

function createNumberedCards(
  seriesId: SeriesId,
  from: number,
  to: number,
  subsets: string[],
): CardRecord[] {
  const cards: CardRecord[] = [];

  for (let number = from; number <= to; number += 1) {
    const subset = subsets[0];
    const formatted = String(number).padStart(3, '0');

    cards.push({
      id: `${seriesId}-${formatted}`,
      number: formatted,
      seriesId,
      subset,
      subsetOrder: 0,
      player: `Karta ${formatted}`,
      team: '',
      owned: false,
      quantity: 0,
      notes: '',
    });
  }

  return cards;
}

function formatCardCode(value: string): string {
  return /^\d{1,3}$/.test(value) ? value.padStart(3, '0') : value.toUpperCase();
}

function isCardCode(value: string): boolean {
  return /^(\d{1,3}|[A-Z0-9]{2,4}-[A-Z0-9]{1,4})$/i.test(value);
}
