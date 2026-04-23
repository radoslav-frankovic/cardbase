import type { CardRecord } from './app';

type ChecklistEntry = readonly [number: string, player: string, signatureCode?: string];

interface SubsetConfig {
  subset: string;
  subsetOrder: number;
  baseParallels: string[];
  autoParallel?: string;
  entries: ChecklistEntry[];
}

const SERIES_ID = 'hokejove-slovensko-2026';

export const HSR_2026_CHECKLIST_CARDS: CardRecord[] = [
  ...buildSubset({
    subset: 'Základný set',
    subsetOrder: 0,
    baseParallels: ['Základná karta', 'Base Blue /50', '/10'],
    entries: parseEntries(`
01|SAMUEL HLAVAJ
02|PATRIK JURČÁK
03|EUGEN RABČAN
04|STANISLAV ŠKORVÁNEK
05|MICHAL BEŇO
06|MAREK ĎALOGA
07|FRANTIŠEK GAJDOŠ
08|MARTIN GERNÁT
09|MICHAL IVAN
10|PATRIK KOCH
11|SAMUEL KŇAŽKO
12|TOMÁŠ KRÁLOVIČ
13|MARTIN MARINČIN
14|DÁVID MUDRÁK
15|DÁVID ROMAŇÁK
16|MISLAV ROSANDIČ
17|PETER CEHLÁRIK
18|LUKÁŠ CINGEL
19|VILIAM ČACHO
20|MAXIM ČAJKOVIČ
21|SEBASTIÁN ČEDERLE
22|MARKO DAŇO
23|DALIBOR DVORSKÝ
24|MARTIN FAŠKO-RUDÁŠ
25|MAREK HECL
26|SAMUEL HONZEK
27|PATRIK HREHORČÁK
28|MAREK HRIVÍK
29|LIBOR HUDÁČEK
30|MARTIN CHROMIAK
31|MILOŠ KELEMEN
32|FILIP KRIVOŠÍK
33|RÓBERT LANTOŠI
34|OLEKSIJ MYKLUCHA
35|OLIVER OKULIAR
36|ŠIMON PETRÁŠ
37|SERVÁC PETROVSKÝ
38|KRISTIÁN POSPÍŠIL
39|MARTIN POSPÍŠIL
40|PAVOL REGENDA
41|MILOŠ ROMAN
42|MATÚŠ SUKEĽ
43|ADAM SÝKORA
44|SAMUEL TAKÁČ
45|TOMÁŠ TATAR
`),
  }),
  ...buildSubset({
    subset: 'Essence',
    subsetOrder: 1,
    baseParallels: ['Base', '1of1'],
    entries: parseEntries(`
ES-1|STANISLAV ŠKORVÁNEK
ES-2|MARTIN FEHÉRVÁRY
ES-3|ŠIMON NEMEC
ES-4|SAMUEL HONZEK
ES-5|MAREK HRIVÍK
ES-6|MARTIN POSPÍŠIL
ES-7|PAVOL REGENDA
ES-8|JURAJ SLAFKOVSKÝ
ES-9|TOMÁŠ TATAR
`),
  }),
  ...buildSubset({
    subset: 'Ink of Time',
    subsetOrder: 2,
    baseParallels: ['Base', '/50'],
    autoParallel: 'Auto /20',
    entries: parseEntries(`
IT-1|RASTISLAV STAŇA|ITS-RS
IT-2|ANDREJ MESZÁROŠ|ITS-AM
IT-3|RADOSLAV SUCHÝ|ITS-SU
IT-4|MICHAL SERSEN|ITS-MS
IT-5|MARTIN ŠTRBÁK|ITS-ST
IT-6|MÁRIO BLIŽŇÁK|ITS-MB
IT-7|VLADIMÍR ORSZÁGH|ITS-VO
IT-8|ŽIGMUND PÁLFFY|ITS-ZP
IT-9|TOMÁŠ SUROVÝ|ITS-TS
`),
  }),
  ...buildSubset({
    subset: 'Beacon of Hope',
    subsetOrder: 3,
    baseParallels: ['Base', '/50', '/25', '/10', '1of1'],
    entries: parseEntries(`
BH-01|VLADIMÍR ORSZÁGH
BH-02|PETER FRÜHAUF
BH-03|ADAM GAJAN
BH-04|SAMUEL HLAVAJ
BH-05|STANISLAV ŠKORVÁNEK
BH-06|PETER ČEREŠŇÁK
BH-07|ERIK ČERNÁK
BH-08|MARTIN FEHÉRVÁRY
BH-09|MARTIN GERNÁT
BH-10|MICHAL IVAN
BH-11|PATRIK KOCH
BH-12|MARTIN MARINČIN
BH-13|ŠIMON NEMEC
BH-14|PETER CEHLÁRIK
BH-15|LUKÁŠ CINGEL
BH-16|DALIBOR DVORSKÝ
BH-17|LIBOR HUDÁČEK
BH-18|MILOŠ KELEMEN
BH-19|ADAM LIŠKA
BH-20|OLIVER OKULIAR
BH-21|MARTIN POSPÍŠIL
BH-22|PAVOL REGENDA
BH-23|ADAM RUŽIČKA
BH-24|JURAJ SLAFKOVSKÝ
BH-25|MATÚŠ SUKEĽ
BH-26|SAMUEL TAKÁČ
BH-27|TOMÁŠ TATAR
`),
  }),
  ...buildSubset({
    subset: 'Top Prospects',
    subsetOrder: 4,
    baseParallels: ['Base', '/50'],
    autoParallel: 'Auto /39',
    entries: parseEntries(`
TP-01|SAMUEL HRENÁK|TPS-SH
TP-02|PATRIK KLIMENT|-
TP-03|ALAN LENĎÁK|TPS-AL
TP-04|MICHAL PRÁDEL|TPS-MP
TP-05|ADAM BELUŠKO|TPS-AB
TP-06|ANDREJ FABUŠ|TPS-AF
TP-07|ADAM GOLJER|TPS-AG
TP-08|SAMUEL HÚŽEVKA|-
TP-09|ADAM KALMAN|TPS-AK
TP-10|FILIP KOVALČÍK|TPS-FK
TP-11|MARCUS KRŠÁK|-
TP-12|FABIAN LIČKO|TPS-FL
TP-13|LUKA RADIVOJEVIČ|TPS-LR
TP-14|PATRIK RUSZNYÁK|TPS-PR
TP-15|TOMÁŠ VAJKO|-
TP-16|DÁVID BALÁŽ|-
TP-17|JAKUB DUBRAVÍK|TPS-JD
TP-18|ALEX GAŠO|TPS-GA
TP-19|JÁN CHOVAN|TPS-JC
TP-20|TOMÁŠ CHRENKO|TPS-TC
TP-21|JAKUB KVIETOK|-
TP-22|MICHAL LIŠČINSKÝ|TPS-LI
TP-23|ONDREJ MARUNA|-
TP-24|ALEX MIŠIAK|TPS-AM
TP-25|PAVOL MORÁVEK|-
TP-26|SAMUEL MURÍN|TPS-SM
TP-27|ADAM NEMEC|TPS-AN
TP-28|TOBIAS PITKA|TPS-TP
TP-29|TOMÁŠ POBEŽAL|TPS-PO
TP-30|VIKTOR STAS|-
TP-31|ANDREAS STRAKA|TPS-AS
TP-32|MICHAL SVRČEK|TPS-MS
TP-33|OLIVER ŠURLÁK|TPS-OS
TP-34|TOBIAS TOMÍK|TPS-TT
TP-35|LUKÁŠ TOMKA|TPS-LT
TP-36|ALEX MIROSLAV ZÁLEŠÁK|TPS-AZ
`),
  }),
  ...buildSubset({
    subset: 'Fantastic Four',
    subsetOrder: 5,
    baseParallels: ['/10'],
    entries: parseEntries(`
FF-HRRS|S. HLAVAJ / E. RABČAN / P. RYBÁR / S. ŠKORVÁNEK
FF-CCDF|P. ČEREŠŇÁK / V. ČACHO / M. DAŇO / M. FAŠKO-RUDÁŠ
FF-DJKP|M. ĎALOGA / M. JEDLIČKA / A. KOLLÁR / K. POSPÍŠIL
FF-FNPR|M. FEHÉRVÁRY / Š. NEMEC / M. POSPÍŠIL / P. REGENDA
FF-IRBF|M. IVAN / M. ROSANDIČ / M. BAKOŠ / M. FAŠKO-RUDÁŠ
FF-KDHH|P. KOCH / M. DAŇO / P. HREHORČÁK / L. HUDÁČEK
FF-MHKT|M. MARINČIN / M. HRIVÍK / M. KELEMEN / T. TATAR
FF-NBFS|Š. NEMEC / S. BUČEK / D. FOMINYCH / A. SÝKORA
FF-VKLT|M. VITALOŠ / A. KUDRNA / A. LUKOŠIK / S. TAKÁČ
FF-CKLO|P. CEHLÁRIK / M. KAŠLÍK / R. LANTOŠI / O. OKULIAR
`),
  }),
  ...buildSubset({
    subset: 'Special Moments',
    subsetOrder: 6,
    baseParallels: ['Base', '/25'],
    autoParallel: 'Auto /10',
    entries: parseEntries(`
SM-28|MATÚŠ HLAVÁČ|SMS-MH
SM-29|MARTIN MARINČIN|SMS-MM
SM-30|PETER CEHLÁRIK|SMS-PC
SM-31|LIBOR HUDÁČEK|SMS-LH
SM-32|TOMÁŠ CHRENKO|SMS-TC
SM-33|MATÚŠ SUKEĽ|SMS-MS
SM-34|ADAM SÝKORA|SMS-AS
SM-35|MIROSLAV ŠATAN|SMS-SA
SM-36|TOMÁŠ TATAR|SMS-TT
`),
  }),
  ...buildSubset({
    subset: 'Homegrown Ice Stars',
    subsetOrder: 7,
    baseParallels: ['Base', '/65'],
    autoParallel: 'Auto /25',
    entries: parseEntries(`
HS-01|DÁVID HRENÁK|HSS-DH
HS-02|PATRIK JURČÁK|HSS-PJ
HS-03|EUGEN RABČAN|HSS-ER
HS-04|MICHAL BEŇO|HSS-MB
HS-05|ANDREJ FABUŠ|HSS-AF
HS-06|ADAM GOLJER|HSS-AG
HS-07|ADAM KALMAN|HSS-AK
HS-08|TOMÁŠ KRÁLOVIČ|HSS-TK
HS-09|DÁVID ROMAŇÁK|HSS-DR
HS-10|MISLAV ROSANDIČ|HSS-MR
HS-11|SEBASTIÁN ČEDERLE|HSS-SC
HS-12|MAREK HECL|HSS-MH
HS-13|TOMÁŠ CHRENKO|HSS-TC
HS-14|FILIP KRIVOŠÍK|HSS-FK
HS-15|JAKUB KVIETOK|HSS-JK
HS-16|OLEKSIJ MYKLUCHA|HSS-OM
HS-17|ŠIMON PETRÁŠ|HSS-SP
HS-18|SAMUEL TAKÁČ|HSS-ST
`),
  }),
  ...buildSubset({
    subset: 'Dynamic Shift',
    subsetOrder: 8,
    baseParallels: ['Base'],
    entries: parseEntries(`
DS-01|SAMUEL HLAVAJ
DS-02|PETER ČEREŠŇÁK
DS-03|MARTIN FEHÉRVÁRY
DS-04|FRANTIŠEK GAJDOŠ
DS-05|MARTIN GERNÁT
DS-06|SAMUEL KŇAŽKO
DS-07|PATRIK KOCH
DS-08|PETER CEHLÁRIK
DS-09|MAXIM ČAJKOVIČ
DS-10|SEBASTIÁN ČEDERLE
DS-11|SAMUEL HONZEK
DS-12|MAREK HRIVÍK
DS-13|PAVOL REGENDA
DS-14|JURAJ SLAFKOVSKÝ
DS-15|MATÚŠ SUKEĽ
DS-16|ADAM SÝKORA
DS-17|SAMUEL TAKÁČ
DS-18|TOMÁŠ TATAR
`),
  }),
  ...buildSubset({
    subset: 'Snapshot Signature /35',
    subsetOrder: 9,
    baseParallels: ['/35'],
    entries: parseEntries(`
SS1-SS|STANISLAV ŠKORVÁNEK
SS1-MI|MICHAL IVAN
SS1-SK|SAMUEL KŇAŽKO
SS1-PK|PATRIK KOCH
SS1-TK|TOMÁŠ KRÁLOVIČ
SS1-MM|MARTIN MARINČIN
SS1-DM|DÁVID MUDRÁK
SS1-DR|DÁVID ROMAŇÁK
SS1-LC|LUKÁŠ CINGEL
SS1-VC|VILIAM ČACHO
SS1-MC|MAXIM ČAJKOVIČ
SS1-MF|MARTIN FAŠKO-RUDÁŠ
SS1-PH|PATRIK HREHORČÁK
SS1-FK|FILIP KRIVOŠÍK
SS1-OO|OLIVER OKULIAR
SS1-SP|SERVÁC PETROVSKÝ
SS1-MR|MILOŠ ROMAN
SS1-AS|ADAM SÝKORA
`),
  }),
  ...buildSubset({
    subset: 'Snapshot Signature /15',
    subsetOrder: 10,
    baseParallels: ['/15'],
    entries: parseEntries(`
SS2-MD|MAREK ĎALOGA
SS2-PC|PETER CEHLÁRIK
SS2-DA|MARKO DAŇO
SS2-LH|LIBOR HUDÁČEK
SS2-RL|RÓBERT LANTOŠI
SS2-KP|KRISTIÁN POSPÍŠIL
SS2-MS|MATÚŠ SUKEĽ
SS2-ST|SAMUEL TAKÁČ
SS2-TT|TOMÁŠ TATAR
`),
  }),
  ...buildSubset({
    subset: 'Shield of Valor',
    subsetOrder: 11,
    baseParallels: ['/30', '/15', '1of1'],
    entries: parseEntries(`
SV-SH|SAMUEL HLAVAJ
SV-PC|PETER ČEREŠŇÁK
SV-EC|ERIK ČERNÁK
SV-MF|MARTIN FEHÉRVÁRY
SV-MI|MICHAL IVAN
SV-SK|SAMUEL KŇAŽKO
SV-PK|PATRIK KOCH
SV-MM|MARTIN MARINČIN
SV-SN|ŠIMON NEMEC
SV-CE|PETER CEHLÁRIK
SV-LC|LUKÁŠ CINGEL
SV-MD|MARKO DAŇO
SV-DD|DALIBOR DVORSKÝ
SV-MH|MAREK HRIVÍK
SV-LH|LIBOR HUDÁČEK
SV-TC|TOMÁŠ CHRENKO
SV-MK|MILOŠ KELEMEN
SV-AL|ADAM LIŠKA
SV-AN|ADAM NEMEC
SV-OO|OLIVER OKULIAR
SV-MP|MARTIN POSPÍŠIL
SV-KP|KRISTIÁN POSPÍŠIL
SV-PR|PAVOL REGENDA
SV-JS|JURAJ SLAFKOVSKÝ
SV-MS|MATÚŠ SUKEĽ
SV-AS|ADAM SÝKORA
SV-TT|TOMÁŠ TATAR
`),
  }),
  ...buildSubset({
    subset: 'Mighty Jersey',
    subsetOrder: 12,
    baseParallels: ['/65'],
    autoParallel: 'Auto /20',
    entries: parseEntries(`
MJ-ER|EUGEN RABČAN|MJS-ER
MJ-MD|MAREK ĎALOGA|MJS-MD
MJ-FG|FRANTIŠEK GAJDOŠ|MJS-FG
MJ-MR|MISLAV ROSANDIČ|MJS-MR
MJ-DA|MARKO DAŇO|MJS-DA
MJ-MF|MARTIN FAŠKO-RUDÁŠ|MJS-MF
MJ-PH|PATRIK HREHORČÁK|MJS-PH
MJ-LH|LIBOR HUDÁČEK|MJS-LH
MJ-OO|OLIVER OKULIAR|MJS-OO
MJ-KP|KRISTIÁN POSPÍŠIL|MJS-KP
`),
  }),
  ...buildSubset({
    subset: 'Mighty Jersey Dual',
    subsetOrder: 13,
    baseParallels: ['/20'],
    entries: parseEntries(`
MJD-RG|EUGEN RABČAN / FRANTIŠEK GAJDOŠ
MJD-RR|EUGEN RABČAN / MISLAV ROSANDIČ
MJD-DG|MAREK ĎALOGA / FRANTIŠEK GAJDOŠ
MJD-DP|MAREK ĎALOGA / KRISTIÁN POSPÍŠIL
MJD-RF|MISLAV ROSANDIČ / MARTIN FAŠKO-RUDÁŠ
MJD-DH|MARKO DAŇO / LIBOR HUDÁČEK
MJD-DO|MARKO DAŇO / OLIVER OKULIAR
MJD-FO|MARTIN FAŠKO-RUDÁŠ / OLIVER OKULIAR
MJD-HH|PATRIK HREHORČÁK / LIBOR HUDÁČEK
MJD-HP|PATRIK HREHORČÁK / KRISTIÁN POSPÍŠIL
`),
  }),
  ...buildSubset({
    subset: 'Blade Force',
    subsetOrder: 14,
    baseParallels: ['/30'],
    autoParallel: 'Auto /15',
    entries: parseEntries(`
BF-JL|JÁN LAŠÁK
BF-TS|TOMÁŠ STAROSTA
BF-LC|LUKÁŠ CINGEL
BF-MC|MAXIM ČAJKOVIČ
BF-SC|SEBASTIÁN ČEDERLE
BF-TC|TOMÁŠ CHRENKO
BF-AK|ANDREJ KUDRNA
BF-RK|ROMAN KUKUMBERG
BF-RL|RÓBERT LANTOŠI
BF-ZP|ŽIGMUND PÁLFFY
BF-MR|MILOŠ ROMAN
BF-ST|SAMUEL TAKÁČ
BF-TT|TOMÁŠ TATAR
BF-MV|MAREK VIEDENSKÝ|-
`),
  }).map((card) => card.number === 'BF-MV' ? { ...card, parallels: ['/30', '1of1'] } : card),
];

function buildSubset(config: SubsetConfig): CardRecord[] {
  return config.entries.map(([number, player, signatureCode], cardOrder) => {
    const hasSignature = Boolean(signatureCode && signatureCode !== '-');
    return {
      id: `${SERIES_ID}-${number.toLowerCase()}`,
      number,
      seriesId: SERIES_ID,
      subset: config.subset,
      player,
      team: '',
      owned: false,
      quantity: 0,
      notes: '',
      subsetOrder: config.subsetOrder,
      cardOrder,
      signatureCode: hasSignature ? signatureCode : undefined,
      parallels: hasSignature && config.autoParallel
        ? [...config.baseParallels, config.autoParallel]
        : config.baseParallels,
    };
  });
}

function parseEntries(text: string): ChecklistEntry[] {
  return text
    .trim()
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [number, player, signatureCode] = line.split('|').map((part) => part.trim());
      return signatureCode ? [number, player, signatureCode] : [number, player];
    });
}
