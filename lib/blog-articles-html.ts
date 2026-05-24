/**
 * Blog article bodies (HTML fragments) per slug and locale — used by `/blog/[slug]`.
 * Keep in sync with `BLOG_POSTS_SOURCE` slug list in `blog-index-locale.ts`.
 */

export type ArticleBodies = { en: string; bg: string }

export const ARTICLE_HTML: Record<string, ArticleBodies> = {
  'understanding-birth-chart-ai-astrology-guide': {
    bg: `
<h2>Наталната карта като чертеж на момента ти на раждане</h2>
<p>Наталната (рождена) карта е снимка на небесната конфигурация в точния час и място на вашето раждане. На AstroHoroscope.online я обработваме като <strong>структуриран анализ на знаци, домове и аспекти</strong>, без „магически предсказания“, а акцент върху самопознание.</p>
<h2>Слънце, Луна и асцендент — трите опорни точки</h2>
<p><strong>Слънцето</strong> показава жизнена тема и стил на изява. <strong>Луната</strong> описва емоционални нужди и сигурност. <strong>Асцендентът</strong> задава начина, по който другите ни възприемат при първи контакт.</p>
<h2>Домове и теми от живота</h2>
<p>Дванадесетте астрологични домове описват сфери — от финанси и ресурс до партньорства и призвание. Точността зависи от <strong>добри координати и час на раждане</strong>.</p>
<h2>Как стъпвате напред към платения анализ</h2>
<p>Изберете план според дълбочина, подайте рождените данни и получете PDF текст с карта на AstroHoroscope.online — вашият хороскоп се превръща в четима, приложима карта към живота ви.</p>
`.trim(),
    en: `
<h2>Why your birth chart is a snapshot of celestial geometry</h2>
<p>Your birth chart freezes the sky at your first breath. At <strong>AstroHoroscope.online</strong> we treat it as a structured map—sign placements, twelve houses, and planetary aspects—focused on reflective insight rather than deterministic prediction.</p>
<h2>Sun, Moon, and Rising: your core triad</h2>
<p>The <strong>Sun</strong> describes life purpose and expressive style; the <strong>Moon</strong> anchors emotional habits; the <strong>Rising (Ascendant)</strong> colors first impressions.</p>
<h2>Houses choreograph real-life themes</h2>
<p>Houses pinpoint where planetary stories play out—from resources and collaborations to vocation and worldview. Reliable houses require an accurate birth location and preferably an exact birth time.</p>
<h2>What's next?</h2>
<p>Choose your reading tier, submit your cosmic coordinates, and download a richly formatted PDF—a practical astro blueprint you can revisit whenever you want clarity.</p>
`.trim(),
  },
  'zodiac-signs-personality-traits-ai-astrology': {
    bg: `
<h2>Зодиакът като темперамент, не като етикет</h2>
<p>Всеки зодиакален знак носи <strong>стил на действие, мотивация и ритъм на реакции</strong>. Професионалното четене гледа пълната карта, но знакът остава важна „вратичка“ към характер.</p>
<h2>Тригон и кръста — стихии и качества на опита</h2>
<p>Подредбата между огън, земя, въздух и вода показава как човек активира ресурс, решава конфликт и усвоява уроци на AstroHoroscope.online.</p>
<h2>Разгледай себе си в контекста на картата</h2>
<p>Отворете платения анализ — ще виждате интерпретация на основните планетни акценти с примерни житейски сценарии и практики за баланс.</p>
`.trim(),
    en: `
<h2>Signs sketch temperament—not fate</h2>
<p>Zodiac glyphs describe habitual rhythms: how curiosity ignites, how stress lands, where generosity flows. Serious astrology weighs the whole sky, yet your Sun sign stays a shorthand entry point.</p>
<h2>Elements orchestrate pacing</h2>
<p>Fire, earth, air, and water mixtures explain whether you stabilize first, theorize endlessly, initiate boldly, or emote vividly—always filtered through planetary dignities on AstroHoroscope.online.</p>
<h2>Bring nuance inside the Birth Chart tiers</h2>
<p>Upgrade from surface traits to nuanced PDF narratives that translate archetypes into conversational coaching cues you can revisit after life shifts.</p>
`.trim(),
  },
  'love-compatibility-zodiac-signs-ai-astrology': {
    bg: `
<h2>Любовта в картата — повече от зодиите</h2>
<p>Венера и Марс, седми и осми дом и лунни модели дават текстура на съвместимостта. Текстово четение на AstroHoroscope.online включва синастрични акценти без обещание за автоматичен „перфектен“ партньор.</p>
<h2>Честност към нуждите ви</h2>
<p>Фокусираме <strong>емоционална сигурност, общи цели и зона за растеж</strong>, което е по-близо до здрава любов от клишета по зодии.</p>
<h2>Готов ли си за съвместимост?</h2>
<p>Планът „Пълна съвместимост“ подава данни за двама и добавя текстов синтез между картите — идеален за двойки или приятели, които искат астрология с смисъл.</p>
`.trim(),
    en: `
<h2>Synastry beyond Sun-sign memes</h2>
<p>Venus, Mars, Lunar needs, eighth-house themes, and shared timing windows shape compatibility more than elemental clichés alone. Our synastry write-ups respect real emotional labor.</p>
<h2>Growth edges vs sparkle</h2>
<p>AstroHoroscope.online highlights harmonies, tensions, consent boundaries, and co-regulation hacks so insights stay grounded for modern relationships.</p>
<h2>Select the Compatibility tier</h2>
<p>Add partner birth data inside the Detailed → Comprehensive flow when you crave dual-chart storytelling with pragmatic talking points—not fortune-teller promises.</p>
`.trim(),
  },
  'career-astrology-zodiac-signs-professions': {
    bg: `
<h2>Средства, цел и „мисия“ през професионалните домове</h2>
<p>Шестият и десетият дом, Сатурн и Слънцето ориентираме към ежедневна работна среда, отговорност и смислено призвание. Пътят не се свежда само до списък „професии по зодия“.</p>
<h2>Вашият екипинг на уменията</h2>
<p>Очертаваме <strong>силата на фокус, стила на управление на времето и сигналите за прегаряне</strong>, за да съедините звездите с управленчески смисъл.</p>
<h2>Вземете анализа и структурирайте следваща стъпка</h2>
<p>В „Задълбочения“ план има разширен раздел за житейско развитие — използвайте го преди промяна на кариера или второ висше.</p>
`.trim(),
    en: `
<h2>Houses choreograph vocation</h2>
<p>Routine (6), public reputation (10), Saturn’s promises, Solar visibility—professional astrology aligns strengths with stewardship, creativity, logistics, strategy, care work, craft, invention, whichever matches your planetary cast.</p>
<h2>Growth cycles over titles</h2>
<p>Rather than a static career label, AstroHoroscope.online suggests timing windows plus skill clusters so experimentation feels sanctioned by your chart—not random.</p>
<h2>Use the Detailed tier as a career workshop</h2>
<p>Open the roadmap section after payment; export the PDF to annotate alongside mentors or coaches who respect intuitive + strategic planning.</p>
`.trim(),
  },
  'daily-horoscope-ai-astrology-personalized': {
    bg: `
<h2>Персонален фокус срещу общия клиширан текст</h2>
<p>Вместо еднакъв абзац за всеки, персонализираният текст на AstroHoroscope.online опира се на вашата карта при подадени данни. Така „днешният акцент“ става смислено привързан към домовете и вашите планети.</p>
<h2>Внимание към дисциплината</h2>
<p>Дори ежеднен ритъм изисква <strong>самонаблюдение</strong>; астрологията указва акцент, не решение от името ви.</p>
<h2>Вървете към пълния доклад</h2>
<p>Плановете с PDF ви дават текст, който може да четете многократно — особено при Луна в транзит към ваши чувствителни точки.</p>
`.trim(),
    en: `
<h2>Rituals vs gimmicks</h2>
<p>Personalized astro notes should reflect your plotted houses—not recycled newspaper blurbs. When you engage AstroHoroscope.online with birth data, we anchor micro-insights inside your cosmic wiring.</p>
<h2>Hydrate intention</h2>
<p>Daily focus works best layered with journaling, breathwork, or movement—anything that embodies the symbolism without outsourcing agency.</p>
<h2>Expand into full PDF journaling</h2>
<p>Bundle short-term prompts with Detailed Analysis excerpts for a hybrid analog + celestial workflow.</p>
`.trim(),
  },
  'planetary-transits-ai-astrology-guide': {
    bg: `
<h2>Какво е транзит</h2>
<p>Транзит е движението на планета в небето спрямо вашата карта днес — може да „покачи“ напрежение към ключов точка или да отвори късче късмет.</p>
<h2>Възможност за промяна, не присъда</h2>
<p>Запазваме тон <strong>подготвени, но не уплашени</strong>: наблюдаваме патерни като финансови решения или емоционални ресети без фатализъм.</p>
<h2>Обогатете с PDF анализа</h2>
<p>Текущите транзити оживяват най-добре срещу фона на пълното ви четене — платеният отчет дава ключовете за домова интерпретация.</p>
`.trim(),
    en: `
<h2>Transit basics</h2>
<p>Bodies in the sky glide across sensitive chart points today, lighting windows for reinvention or caution—not verdicts etched in marble.</p>
<h2>Use transits ethically</h2>
<p>AstroHoroscope.online frames them as choreography tips: reschedule launches, deepen rest, revise contracts, revisit therapy goals—timed with symbolism, synced with autonomy.</p>
<h2>Marry snapshots with longitudinal PDF scans</h2>
<p>Pair live transit journaling with evergreen natal narratives from your tiered purchase.</p>
`.trim(),
  },
  'astrological-aspects-ai-astrology-guide': {
    bg: `
<h2>Аспектите като диалози между планети</h2>
<p>Цифлените дистанции между планетите създават <strong>напрежение или подкрепа</strong> — главен квартал, секстил, секундатор и др. Изкуството е да „чуете всички гласове“, не само любимото си.</p>
<h2>Вътрешен театър</h2>
<p>Разрив между Луна и Сатурн може да значи нужда от граници; хармония между Венера и Юпитер — смелост за смислен риск. Текстовете ни свързват това с реалността.</p>
<h2>Виж всичко в PDF доклада</h2>
<p>В „Detailed“ ниво има по-пълното разглеждане на аспекти — добавете маркери и лични бележки.</p>
`.trim(),
    en: `
<h2>Aspect grammar</h2>
<p>Squares, trines, sextiles—these harmonic or frictional dialogues weave inner councils. Respect each voice—even the grouchy Saturn square—because tension fuels skill.</p>
<h2>Stories with coaching hooks</h2>
<p>Paid analyses translate geometry into journaling cues: reframes after Moon–Pluto oppositions or collaborative lifts when Jupiter trines your Sun.</p>
<h2>Deepen aspect literacy</h2>
<p>Upgrade tiers for nuanced PDF glossaries bridging classical + modern delineations readable on AstroHoroscope.online.</p>
`.trim(),
  },
  'astrological-houses-ai-astrology-guide': {
    bg: `
<h2>Пътешествие през домовете</h2>
<p>Всеки дом е сцена от живота: аз, ресурси, братя, дом, любовни романи, рутини, партньори, трансформация, учене, кариера, общности, покой, себе-сакрализация.</p>
<h2>Важността на точното време</h2>
<p>Час определя <strong>cusp на асцендента и МС</strong> — без него интерпретациите стават условни; използвайте апоксимация с прозрачност.</p>
<h2>Върви към пълното четене</h2>
<p>„Detailed“ включва секции за ключовите домакинства и препоръки за употреба в ежедневието.</p>
`.trim(),
    en: `
<h2>House sequence as life screenplay</h2>
<p>Houses scaffold identity, livelihood, alliances, metamorphoses, philosophies, vocation, alliances, solitude, dissolution, rebirth. Each doorway hosts planetary casts that rotate across decades.</p>
<h2>Keeper of time-sensitive cusps</h2>
<p>Angles shift rapidly; approximating noon births still yields insight but label uncertainty honestly—precision unlocks sharper PDF segments.</p>
<h2>Expand into Guided tier</h2>
<p>Select Detailed Analysis to unlock narrative bridges between adjoining houses AstroHoroscope.online highlights as active.</p>
`.trim(),
  },
  'astrological-elements-ai-astrology-guide': {
    bg: `
<h2>Огън, Земя, Въздух и Вода</h2>
<p>Елементите отразяват <strong>темпото и стила на смислово усвояване</strong>; четирите смесени в вашата карта формират вътрешния климат.</p>
<h2>Съзнателен баланс</h2>
<p>„Липсите“ подсказват баланси: земен акцент търси конкретни стъпки; воден — дневник на емоции; огнен — смели, но етични рискове; въздушен — ясни договорености в общуването.</p>
<h2>Грабнете PDF акцент</h2>
<p>Началният план подчертава ключовите личностни теми, докато задълбоченият добавя смесите между елементи и модалитети.</p>
`.trim(),
    en: `
<h2>Tempering the elements</h2>
<p>Birth charts braid fire’s ignition, earth’s scaffolding, air’s narration, water’s dissolution. AstroHoroscope.online maps where you amplify or temper each temperament.</p>
<h2>Growth homework</h2>
<p>Lean rituals—trail runs for fire journaling, tactile budgets for earth, debating clubs for air, embodied baths for water—bring symbolic balance.</p>
<h2>Open your PDF palette</h2>
<p>Each tier color-codes dominant elements so skim-reading becomes visceral onboarding.</p>
`.trim(),
  },
  'astrological-modalities-ai-astrology-guide': {
    bg: `
<h2>Кръстни, фиксирани и подвижни знаци</h2>
<p>Модалностите указват <strong>как знаците действат</strong> — иницииране на цикъл, задържане, адаптиране. Така разбираме конфликтите в проектите ви.</p>
<h2>В екип или сам</h2>
<p>Разпознайте кога да промените ролята си между стартер, финализатор или посредник с помощ от астрологичното обобщение на AstroHoroscope.online.</p>
<h2>Вземете пълния разказ</h2>
<p>В задълбочения анализ текстът съчетава домовете с модалитета на знаците ви.</p>
`.trim(),
    en: `
<h2>Cardinal, fixed, mutable momentum</h2>
<p>Cardinals ignite, fixed stabilize, mutable remix. Respect modality collisions when aligning teams—they explain friction without blame.</p>
<h2>Leverage modality coaching</h2>
<p>Use PDF insights to orchestrate brainstorming (cardinal), iterative QA (fixed), or agile pivots (mutable) as your chart dictates.</p>
<h2>Add synastry for teams</h2>
<p>Expand into Comprehensive Compatibility to narrate collaborator chemistry through modality overlays.</p>
`.trim(),
  },
  'retrograde-planets-ai-astrology-guide': {
    bg: `
<h2>Привидно „назад“, реалността — преговор и ревизия</h2>
<p>Ретроградността е оптическа условност. В текста ни тя символизира <strong>вторичен преговор на темите на планетата</strong> — Меркурий и комуникация, Венера и желанията, Марс и граници.</p>
<h2>Не е проклятие</h2>
<p>Изключете паника: фокус върху качество, QA, финансови записи или емоционална загриженост има смисъл по всяко време.</p>
<h2>Върви към дълбок текст</h2>
<p>В платения анализ можете да маркирате кои ретрофази активират ключов дом — PDF оставя бъдеща справка.</p>
`.trim(),
    en: `
<h2>Retrogrades as cinematic rewinds</h2>
<p>Planets appearing to move backward cue review arcs—perfect for editing campaigns, renewing vows, refactoring code, rewriting boundaries.</p>
<h2>Use panic-free PR</h2>
<p>AstroHoroscope.online demystifies retrogrades with grounded tasks so self-care stays pragmatic during Mercury rehearsals or Venus inventories.</p>
<h2>Add calendar commentary</h2>
<p>Juxtapose transit PDF excerpts with planners to avoid toxic hustle culture pretending retrogrades forbid progress.</p>
`.trim(),
  },
}
