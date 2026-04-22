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
  cardOrder?: number;
  player: string;
  team: string;
  owned: boolean;
  quantity: number;
  copies?: OwnedCopy[];
  notes: string;
  signatureCode?: string;
  parallels?: string[];
  photo?: string;
}

interface OwnedCopy {
  id: string;
  parallel: string;
  serial: string;
}

interface CopyGroup {
  key: string;
  label: string;
  count: number;
  serials: string[];
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

const PARALLELS_BY_SUBSET: Record<string, string[]> = {
  'Zakladny set': ['Zakladna karta', 'Base Blue', 'Red Light /30', 'Golden Glow /15', 'Night Fireworks 1of1'],
  'Team Unity': ['/7'],
  'Ice Stars: New Era': ['Base', 'Sapphire Blue /45', 'Autumn Copper /10', 'Harvest Gold /5', 'Onyx Black 1of1'],
  'What a Save': ['Base', '/80', 'Auto /45', '1of1'],
  'Leadership Trio': ['/15'],
  'Authentic Signature Level 2': ['/35'],
  'Authentic Signature Level 1': ['/75'],
  'League Legends': ['Base', 'Auto /35'],
  'Rookie Rockets': ['Base', 'Bright Blue /85', 'Gold Auto /55', '1of1'],
  'Ultimate Origin Fusion Edition': ['/20'],
  'Game Jersey': ['/75', 'Auto /25'],
  'Ultimate Origin Scripted Edition': ['/9', '/6', '/4', '/3', '/2', '1of1'],
  Powerhouse: ['Base'],
  Flashback: ['Base', '/60', 'Auto /35'],
  'Defensive Duo': ['Base', '/20', 'Auto /10'],
  Essence: ['Base', '1of1'],
  '100% Focused': ['Base', '/60', 'Auto /40'],
};

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

    return this.cards()
      .filter((card) => {
        const matchesSeries = card.seriesId === selectedSeriesId;
        const matchesSubset = card.subset === selectedSubset;
        const haystack = this.normalize(`${card.number} ${card.player} ${card.team} ${card.subset}`);
        const matchesSearch = !query || haystack.includes(query);
        const matchesOwnership =
          ownershipFilter === 'all' ||
          (ownershipFilter === 'owned' && this.cardCopies(card).length > 0) ||
          (ownershipFilter === 'missing' && this.cardCopies(card).length === 0) ||
          (ownershipFilter === 'withPhoto' && Boolean(card.photo));

        return matchesSeries && matchesSubset && matchesSearch && matchesOwnership;
      })
      .sort(compareCards);
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
    const owned = cards.filter((card) => this.cardCopies(card).length > 0).length;
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
        next.copies = patch.copies !== undefined ? normalizeCopyList(next, patch.copies) : normalizeCopies(next);
        next.quantity = next.copies.length;
        next.owned = next.quantity > 0;

        return next;
      }),
    );
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

  parallelOptions(card: CardRecord): string[] {
    return card.parallels?.length ? card.parallels : PARALLELS_BY_SUBSET[card.subset] ?? ['Base'];
  }

  cardCopies(card: CardRecord): OwnedCopy[] {
    return normalizeCopies(card);
  }

  copySummary(card: CardRecord): string {
    const groups = this.copyGroups(card);
    if (groups.length === 0) {
      return '';
    }

    return groups.map((group) => fullGroupLabel(group)).join(', ');
  }

  compactCopySummary(card: CardRecord): string {
    const groups = this.copyGroups(card);
    if (groups.length === 0) {
      return '-';
    }

    return groups.map((group) => compactGroupLabel(group)).join(' | ');
  }

  copyLabel(copy: OwnedCopy): string {
    return formatCopySummary(copy);
  }

  copyGroups(card: CardRecord): CopyGroup[] {
    return groupCopies(this.cardCopies(card));
  }

  addCopy(card: CardRecord): void {
    const options = this.parallelOptions(card);
    const copies = this.cardCopies(card);
    this.updateCard(card.id, {
      copies: [
        ...copies,
        {
          id: crypto.randomUUID(),
          parallel: options[0] ?? 'Base',
          serial: '',
        },
      ],
    });
  }

  updateCopy(card: CardRecord, copyId: string, patch: Partial<OwnedCopy>): void {
    this.updateCard(card.id, {
      copies: this.cardCopies(card).map((copy) => (copy.id === copyId ? { ...copy, ...patch } : copy)),
    });
  }

  removeCopy(card: CardRecord, copyId: string): void {
    this.updateCard(card.id, {
      copies: this.cardCopies(card).filter((copy) => copy.id !== copyId),
    });
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
        copies: normalizeCopies(storedCard),
        owned: normalizeCopies(storedCard).length > 0,
        quantity: normalizeCopies(storedCard).length,
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
    const cardOrder = (left.cardOrder ?? 9999) - (right.cardOrder ?? 9999);

    return seriesOrder || subsetOrder || cardOrder || compareCardNumbers(left.number, right.number);
  });
}

function normalizeStoredCard(card: CardRecord): CardRecord {
  const legacySeriesIds: Record<string, SeriesId> = {
    s1: 'tipsport-s1',
    s2: 'tipsport-s2',
  };
  const seriesId = legacySeriesIds[card.seriesId] ?? card.seriesId;
  const number = formatCardCode(card.number);

  const copies = normalizeCopies(card);

  return {
    ...card,
    id: `${seriesId}-${number.toLowerCase()}`,
    number,
    seriesId,
    copies,
    quantity: copies.length,
    owned: copies.length > 0,
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
      cardOrder: number - from,
      player: `Karta ${formatted}`,
      team: '',
      owned: false,
      quantity: 0,
      copies: [],
      notes: '',
    });
  }

  return cards;
}

function normalizeCopies(card: CardRecord): OwnedCopy[] {
  if (card.copies?.length) {
    return normalizeCopyList(card, card.copies);
  }

  if (card.quantity > 0 || card.owned) {
    return Array.from({ length: Math.max(1, card.quantity || 1) }, () => ({
      id: crypto.randomUUID(),
      parallel: defaultParallelFor(card),
      serial: '',
    }));
  }

  return [];
}

function normalizeCopyList(card: CardRecord, copies: OwnedCopy[]): OwnedCopy[] {
  return copies.map((copy) => ({
    id: copy.id || crypto.randomUUID(),
    parallel: copy.parallel || defaultParallelFor(card),
    serial: copy.serial || '',
  }));
}

function groupCopies(copies: OwnedCopy[]): CopyGroup[] {
  const groups = new Map<string, CopyGroup>();

  for (const copy of copies) {
    const serial = copy.serial.trim();
    const key = copy.parallel;
    const group = groups.get(key) ?? { key, label: copy.parallel, count: 0, serials: [] };
    group.count += 1;
    if (serial) {
      group.serials.push(serial);
    }
    groups.set(key, group);
  }

  return Array.from(groups.values());
}

function fullGroupLabel(group: CopyGroup): string {
  const serials = group.serials.length ? ` ${group.serials.join(', ')}` : '';
  return `${group.count > 1 ? `${group.count}x ` : ''}${group.label}${serials}`;
}

function compactGroupLabel(group: CopyGroup): string {
  const label = compactParallelLabel(group.label, group.serials);
  const serials = group.serials.length ? ` ${group.serials.join(', ')}` : '';
  return `${group.count > 1 ? `${group.count}x ` : ''}${label}${serials}`.trim();
}

function formatCopySummary(copy: OwnedCopy): string {
  const serial = copy.serial.trim();
  if (!serial) {
    return copy.parallel;
  }

  const serialLimit = serial.match(/^\d+\s*\/\s*(\d+)$/)?.[1];
  const isOneOfOneSerial = /^1\s*\/\s*1$|^1of1$/i.test(serial);
  const parallel = isOneOfOneSerial && /1of1/i.test(copy.parallel)
    ? copy.parallel.replace(/1of1/gi, '').trim()
    : serialLimit
    ? copy.parallel.replace(new RegExp(`\\s*/\\s*${serialLimit}\\b`), '').trim()
    : copy.parallel;

  return `${parallel} ${serial}`.trim();
}

function compactCopyLabel(copy: OwnedCopy): string {
  const serial = copy.serial.trim();
  const label = compactParallelLabel(copy.parallel, serial ? [serial] : []);
  return `${label}${serial ? ` ${serial}` : ''}`.trim();
}

function compactParallelLabel(parallel: string, serials: string[]): string {
  if (/1of1/i.test(parallel) || serials.some((serial) => /^1\s*\/\s*1$|^1of1$/i.test(serial))) {
    return '1of1';
  }

  return parallel
    .replace('Zakladna karta', 'Base')
    .replace('Base Blue', 'Blue')
    .replace('Red Light', 'Red')
    .replace('Golden Glow', 'Gold')
    .replace('Sapphire Blue', 'Sapphire')
    .replace('Autumn Copper', 'Copper')
    .replace('Harvest Gold', 'Harvest')
    .replace('Onyx Black', 'Onyx')
    .replace('Bright Blue', 'Bright')
    .replace('Gold Auto', 'Auto');
}

function defaultParallelFor(card: CardRecord): string {
  return PARALLELS_BY_SUBSET[card.subset]?.[0] ?? 'Base';
}

function compareCards(left: CardRecord, right: CardRecord): number {
  return (
    (left.subsetOrder ?? 999) - (right.subsetOrder ?? 999) ||
    (left.cardOrder ?? 9999) - (right.cardOrder ?? 9999) ||
    compareCardNumbers(left.number, right.number)
  );
}

function compareCardNumbers(left: string, right: string): number {
  return left.localeCompare(right, undefined, { numeric: true });
}

function formatCardCode(value: string): string {
  return /^\d{1,3}$/.test(value) ? value.padStart(3, '0') : value.toUpperCase();
}
