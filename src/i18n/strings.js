/**
 * UI string dictionaries for the /editor profile (English + Arabic).
 * Arabic is written naturally, not translated word-for-word.
 * Product and software names remain as brands; visible UI and descriptions are localized.
 */

export const STRINGS = {
  // --- Identity ---
  name: { en: 'Ibrahim A. Soliman', ar: 'إبراهيم شُعيل' },

  // --- Navbar ---
  nav: {
    home: { en: 'Home', ar: 'الرئيسية' },
    about: { en: 'About', ar: 'من أنا' },
    videos: { en: 'Videos', ar: 'الأعمال' },
    series: { en: 'Series', ar: 'السلاسل' },
    gallery: { en: 'Gallery', ar: 'المعرض' },
    social: { en: 'Channels', ar: 'القنوات' },
    contact: { en: 'Contact', ar: 'تواصل' },
    switchToDev: { en: 'Developer', ar: 'مبرمج' },
    themeLight: { en: 'Light', ar: 'فاتح' },
    themeDark: { en: 'Dark', ar: 'داكن' },
    langLabel: { en: 'العربية', ar: 'English' }, // shows the language you'll switch TO
  },

  // --- Hero (editor) ---
  hero: {
    roles: {
      en: ['Video Editor', 'Motion Designer', 'Visual Storyteller', 'Content Creator'],
      ar: ['مونتير فيديو', 'مصمم موشن', 'صانع محتوى بصري', 'صانع محتوى'],
    },
    imA: { en: "I'm a ", ar: 'أنا ' },
    description: {
      en: 'I turn ideas into clear, engaging videos — focusing on storytelling, pacing, and holding attention. From editorial motion and explainers to infographics and animated maps.',
      ar: 'أحوّل الأفكار إلى فيديوهات واضحة وجذابة، بتركيز على السرد والإيقاع والقدرة على جذب الانتباه؛ من الموشن التحريري والفيديوهات التوضيحية إلى الإنفوجرافيك والخرائط المتحركة.',
    },
    viewWork: { en: 'View Work', ar: 'شاهد الأعمال' },
    aboutMe: { en: 'About Me', ar: 'من أنا' },
  },

  // --- About (editor) ---
  about: {
    eyebrow: { en: 'Who I Am', ar: 'من أنا' },
    title: { en: 'About', ar: 'نبذة' },
    skillsTitle: { en: 'Skills', ar: 'المهارات' },
    showMore: { en: 'Show more', ar: 'عرض المزيد' },
    showLess: { en: 'Show less', ar: 'عرض أقل' },
    paragraphs: {
      en: [
        "a video editor, motion graphics designer, and visual content creator. I help project owners and content creators turn ideas and information into clear, engaging videos, with special attention to narrative, pacing, and holding the viewer's attention.",
        'My work spans editorial motion, explainers, infographics, animated maps, and visual content design across marketing, brand, and information-driven video.',
        "I don't treat video as just cutting clips and adding transitions. I start by understanding the goal of the content and the target audience, then build the editing style, motion, and design to serve the message and keep it clear.",
        'My experience covers idea development, research and fact-checking, scriptwriting, scene planning, and preparing visual assets — then executing the edit and motion graphics to match the voiceover and video timing. I use Premiere Pro, After Effects, Photoshop, and Illustrator, and I build custom scripts and tools inside After Effects to automate repetitive tasks and improve consistency.',
      ],
      ar: [
        'مونتير فيديو ومصمم موشن جرافيك وصانع محتوى بصري. أساعد أصحاب المشاريع وصنّاع المحتوى على تحويل الأفكار والمعلومات إلى فيديوهات واضحة وجذابة، مع اهتمام خاص بالسرد والإيقاع والقدرة على جذب المشاهد.',
        'يشمل عملي الموشن التحريري والفيديوهات التوضيحية والإنفوجرافيك والخرائط المتحركة وتصميم المحتوى البصري لمحتوى التسويق والعلامات التجارية والمحتوى المعلوماتي.',
        'لا أتعامل مع المونتاج كمجرد قص ولصق وإضافات انتقالية. أبدأ من فهم هدف المحتوى والجمهور المستهدف، ثم أبني أسلوب المونتاج والموشن والتصميم ليخدم الرسالة ويحافظ على وضوحها.',
        'تغطي تجربتي تطوير الفكرة والبحث والتحقق والتأليف وتخطيط المشاهد وتجهيز العناصر البصرية، ثم تنفيذ المونتاج والموشن جرافيك بما يتناسب مع التعليق الصوتي وتوقيت الفيديو. أعمل على Premiere Pro وAfter Effects وPhotoshop وIllustrator، وأبني أدوات وسكريبتات داخل After Effects لأتمتة المهام المتكررة ورفع جودة التنفيذ.',
      ],
    },
    skills: {
      en: [
        { title: 'Video Editing & Montage', desc: 'Narrative-driven cutting, pacing, rhythm, and attention retention across long-form and short-form content.' },
        { title: 'Motion Graphics', desc: 'Kinetic typography, animated lower-thirds, transitions, and scene motion built in After Effects.' },
        { title: 'Infographics & Animated Maps', desc: 'Turning data, relationships, and information into clear animated visuals and geographic maps.' },
        { title: 'Scriptwriting & Research', desc: 'Idea development, research and fact-checking, scriptwriting, and scene planning.' },
        { title: 'Visual Content Design', desc: 'Thumbnails, frame design, and visual identity for videos and social media.' },
        { title: 'Adobe Creative Cloud', desc: 'Premiere Pro, After Effects, Photoshop, and Illustrator — full production pipeline.' },
        { title: 'AE Automation', desc: 'Custom After Effects scripts and tools to automate repetitive tasks and speed up production.' },
      ],
      ar: [
        { title: 'مونتاج الفيديو', desc: 'قص يحركه السرد، مع إيقاع واضح والقدرة على الاحتفاظ بالانتباه في المحتوى الطويل والقصير.' },
        { title: 'موشن جرافيك', desc: 'كتابة حركية، عناوين سفلية متحركة، انتقالات وحركة للمشاهد داخل After Effects.' },
        { title: 'إنفوجرافيك وخرائط متحركة', desc: 'تحويل البيانات والعلاقات والمعلومات إلى عناصر بصرية واضحة ومتحركة وخرائط جغرافية.' },
        { title: 'تأليف وبحث', desc: 'تطوير الفكرة، البحث والتحقق، التأليف وتخطيط المشاهد.' },
        { title: 'تصميم المحتوى البصري', desc: 'صور مصغرة، تصميم الإطارات والهوية البصرية للفيديوهات ومنصات التواصل.' },
        { title: 'Adobe Creative Cloud', desc: 'Premiere Pro وAfter Effects وPhotoshop وIllustrator — خط إنتاج متكامل.' },
        { title: 'أتمتة After Effects', desc: 'سكريبتات وأدوات داخل After Effects لأتمتة المهام المتكررة وتسريع الإنتاج.' },
      ],
    },
  },

  // --- VideoShowcase ---
  videos: {
    eyebrow: { en: 'Portfolio', ar: 'الأعمال' },
    title: { en: 'Videos', ar: 'الأعمال' },
    intro: {
      en: 'A selection of my editing, motion graphics, and visual storytelling work. Click any thumbnail to watch, or use the share button to grab a direct link.',
      ar: 'مجموعة من أعمالي في المونتاج والموشن جرافيك والسرد البصري. اضغط على أي صورة للمشاهدة، أو استخدم زر المشاركة للحصول على رابط مباشر.',
    },
    featured: { en: 'Featured', ar: 'مميز' },
    shareVideo: { en: 'Share video', ar: 'مشاركة' },
    linkCopied: { en: 'Link copied', ar: 'تم النسخ' },
    watchAndShare: { en: 'Watch & share', ar: 'شاهد وشارك' },
    partOfSeries: { en: 'Part of a series', ar: 'جزء من سلسلة' },
    exploreProject: { en: 'Explore project', ar: 'استكشف المشروع' },
  },

  // --- Collections ---
  series: {
    eyebrow: { en: 'Connected Work', ar: 'أعمال مرتبطة' },
    title: { en: 'Series', ar: 'السلاسل' },
    intro: {
      en: 'Multi-part projects and editorial series — watch the full set in one place.',
      ar: 'مشاريع متعددة الأجزاء وسلاسل تحريرية — شاهد المجموعة كاملة في مكان واحد.',
    },
    videosCount: { en: 'videos', ar: 'فيديو' },
    watchSeries: { en: 'Watch series', ar: 'شاهد السلسلة' },
  },

  // --- Gallery ---
  gallery: {
    eyebrow: { en: 'Visuals', ar: 'مرئيات' },
    title: { en: 'Gallery', ar: 'المعرض' },
    intro: {
      en: 'Motion graphics stills, thumbnails, infographic frames, and visual design work.',
      ar: 'لقطات موشن جرافيك، صور مصغرة، إطارات إنفوجرافيك وأعمال تصميم بصري.',
    },
    all: { en: 'All', ar: 'الكل' },
    empty: {
      en: 'Gallery coming soon. Add images to public/gallery/ and entries to data/gallery.json.',
      ar: 'المعرض قريبًا. أضف الصور إلى public/gallery/ والمدخلات إلى data/gallery.json.',
    },
  },

  // --- Share pages (common) ---
  share: {
    fullPortfolio: { en: 'Full portfolio', ar: 'كل الأعمال' },
    copyLink: { en: 'Copy link', ar: 'نسخ الرابط' },
    copySeriesLink: { en: 'Copy series link', ar: 'نسخ رابط السلسلة' },
    linkCopied: { en: 'Link copied', ar: 'تم النسخ' },
    hireMe: { en: 'Hire me', ar: 'اطلب خدمة' },
    whatsapp: { en: 'WhatsApp', ar: 'واتساب' },
    videoNotFound: { en: 'Video not found', ar: 'الفيديو غير موجود' },
    videoNotFoundSub: { en: 'This video may have been moved or removed.', ar: 'قد يكون هذا الفيديو قد نُقل أو أُزيل.' },
    collectionNotFound: { en: 'Collection not found', ar: 'السلسلة غير موجودة' },
    collectionNotFoundSub: { en: 'This collection may have been moved or removed.', ar: 'قد تكون هذه السلسلة قد نُقلت أو أُزيلت.' },
    backToPortfolio: { en: 'Back to portfolio', ar: 'العودة للأعمال' },
  },

  // --- VideoSharePage ---
  vsp: {
    moreWork: { en: 'More work', ar: 'أعمال أخرى' },
    moreWorkEyebrow: { en: 'Selected projects', ar: 'مشروعات مختارة' },
    moreWorkIntro: { en: 'Explore related work selected by language, format, and creative approach.', ar: 'استكشف أعمالًا مرتبطة مختارة حسب اللغة والصيغة والأسلوب الإبداعي.' },
    openProject: { en: 'View project', ar: 'عرض المشروع' },
    portrait: { en: 'Portrait', ar: 'رأسي' },
    square: { en: 'Square', ar: 'مربع' },
    landscape: { en: 'Landscape', ar: 'أفقي' },
    formatsLabel: { en: 'Formats', ar: 'الصيغ' },
  },

  // --- CollectionSharePage ---
  csp: {
    seriesBadge: { en: 'Series', ar: 'سلسلة' },
    partOf: { en: 'Part', ar: 'الجزء' },
    of: { en: 'of', ar: 'من' },
    inThisSeries: { en: 'In this series', ar: 'في هذه السلسلة' },
  },

  // --- Contact ---
  contact: {
    title: { en: 'Contact', ar: 'تواصل' },
    editorMessage: {
      en: 'Available for video editing, motion graphics, and content production work.',
      ar: 'متاح لأعمال مونتاج الفيديو، الموشن جرافيك، وإنتاج المحتوى.',
    },
    devMessage: {
      en: 'Available for full-stack projects, DevOps, and mobile app publishing.',
      ar: 'متاح لمشاريع Full-stack، DevOps، ونشر تطبيقات الموبايل.',
    },
    email: { en: 'Email', ar: 'البريد' },
    whatsapp: { en: 'WhatsApp', ar: 'واتساب' },
  },

  // --- Social Media (channels) ---
  social: {
    title: { en: 'Content Creation', ar: 'صناعة المحتوى' },
    intro: {
      en: 'Two Arabic channels where I write, edit, and produce everything end-to-end — engineering discipline applied to cinematic storytelling.',
      ar: 'قناتان عربيتان أتولّى فيهما التأليف والمونتاج والإنتاج بالكامل — انضباط هندسي يُطبَّق على سرد سينمائي.',
    },
    youtube: { en: 'YouTube', ar: 'يوتيوب' },
    niche: { en: 'Niche', ar: 'التخصص' },
    format: { en: 'Format', ar: 'الصيغة' },
    documentary: { en: 'Documentary', ar: 'وثائقي' },
    longForm: { en: 'Long-form', ar: 'طويل' },
    storBamin: {
      tagline: { en: 'Islamic Biography & History', ar: 'سيرة وتاريخ إسلامي' },
      description: {
        en: 'Arabic documentary-style history channel focused on Islamic biography and early Islamic history — major battles, companions, and pivotal moments through concise, cinematic storytelling.',
        ar: 'قناة تاريخية وثائقية عربية متخصصة في السيرة النبوية والتاريخ الإسلامي المبكر — المعارك الكبرى، الصحابة، والأحداث المحورية بأسلوب سردي سينمائي موجز.',
      },
    },
    tecBamin: {
      tagline: { en: 'Tech, Long-Form', ar: 'تقنية، محتوى طويل' },
      description: {
        en: 'Arabic tech channel producing in-depth long-form videos — consumer technology, AI, digital trends, and gaming turned into clear, engaging video storytelling.',
        ar: 'قناة تقنية عربية تنتج فيديوهات طويلة متعمقة — التقنية الاستهلاكية، الذكاء الاصطناعي، التوجهات الرقمية، والألعاب محوّلة إلى سرد فيديو واضح وجذاب.',
      },
    },
  },

  // --- Footer ---
  footer: {
    editorTagline: { en: 'Video Editor, Motion Designer & Content Creator', ar: 'مونتير فيديو، مصمم موشن وصانع محتوى' },
    devTagline: { en: 'Full Stack Engineer & DevOps', ar: 'مهندس برمجيات و DevOps' },
    email: { en: 'Email', ar: 'البريد' },
    whatsapp: { en: 'WhatsApp', ar: 'واتساب' },
    rights: {
      en: 'All rights reserved.',
      ar: 'جميع الحقوق محفوظة.',
    },
  },

  // --- Inquiry / Hire form ---
  inquiry: {
    title: { en: 'Request a service', ar: 'اطلب خدمة' },
    subtitle: {
      en: 'Tell me about your project and I will get back to you.',
      ar: 'احكِ لي عن مشروعك وسأعود إليك في أقرب وقت.',
    },
    steps: {
      contact: { en: 'Contact', ar: 'التواصل' },
      scope: { en: 'Project scope', ar: 'نطاق المشروع' },
      plan: { en: 'Plan & send', ar: 'الخطة والإرسال' },
    },
    next: { en: 'Continue', ar: 'متابعة' },
    back: { en: 'Back', ar: 'السابق' },
    optional: { en: 'Optional', ar: 'اختياري' },
    name: { en: 'Name', ar: 'الاسم' },
    namePlaceholder: { en: 'Your name', ar: 'اسمك' },
    contact: { en: 'Contact', ar: 'وسيلة التواصل' },
    contactMethod: { en: 'Contact method', ar: 'طريقة التواصل' },
    email: { en: 'Email', ar: 'البريد الإلكتروني' },
    whatsapp: { en: 'WhatsApp', ar: 'واتساب' },
    countryCode: { en: 'Country calling code', ar: 'مفتاح الدولة' },
    chooseCountry: { en: 'Choose country code', ar: 'اختر مفتاح الدولة' },
    emailPlaceholder: { en: 'name@example.com', ar: 'name@example.com' },
    phonePlaceholder: { en: 'Phone number without leading zero', ar: 'رقم الهاتف بدون الصفر الأول' },
    projectType: { en: 'Project type', ar: 'نوع المشروع' },
    projectTypePlaceholder: { en: 'Select a project type', ar: 'اختر نوع المشروع' },
    projectTypeOptions: {
      en: ['Video Editing', 'Motion Graphics', 'Infographic', 'Animated Maps', 'Full Production', 'Other'],
      ar: ['مونتاج فيديو', 'موشن جرافيك', 'إنفوجرافيك', 'خرائط متحركة', 'إنتاج كامل', 'أخرى'],
    },
    length: { en: 'Expected video length', ar: 'المدة المتوقعة للفيديو' },
    lengthOptions: {
      en: ['Under 60 seconds', '1–5 minutes', '5–15 minutes', 'Over 15 minutes'],
      ar: ['أقل من 60 ثانية', 'من دقيقة إلى 5 دقائق', 'من 5 إلى 15 دقيقة', 'أكثر من 15 دقيقة'],
    },
    services: { en: 'What do you need?', ar: 'ما الخدمات التي تحتاجها؟' },
    serviceOptions: {
      en: ['Video editing', 'Motion graphics', 'Infographic', 'Animated maps', 'Research & script', 'Subtitles', 'Sound design', 'Thumbnail', 'Full production'],
      ar: ['مونتاج الفيديو', 'موشن جرافيك', 'إنفوجرافيك', 'خرائط متحركة', 'بحث وكتابة', 'ترجمة نصية', 'تصميم صوتي', 'صورة مصغرة', 'إنتاج كامل'],
    },
    assets: { en: 'Current project materials', ar: 'حالة مواد المشروع' },
    assetOptions: {
      en: ['Ready to start', 'Partially ready', 'Need full production'],
      ar: ['جاهزة للبدء', 'جاهزة جزئيًا', 'أحتاج إنتاجًا كاملًا'],
    },
    timeline: { en: 'Preferred timeline', ar: 'موعد التسليم المناسب' },
    timelineOptions: {
      en: ['As soon as possible', 'Within 1–2 weeks', 'Within a month', 'Flexible'],
      ar: ['في أقرب وقت', 'خلال أسبوع إلى أسبوعين', 'خلال شهر', 'مرن'],
    },
    deadlineDate: { en: 'Target date', ar: 'التاريخ المستهدف' },
    timelineNote: { en: 'Deadline details', ar: 'تفاصيل الموعد' },
    timelineNotePlaceholder: { en: 'Example: before 20 September, or during the first week of next month', ar: 'مثال: قبل 20 سبتمبر، أو خلال الأسبوع الأول من الشهر القادم' },
    budget: { en: 'Estimated budget', ar: 'الميزانية التقديرية' },
    budgetOptions: {
      en: ['Under $100', '$100–$300', '$300–$700', '$700+', 'Let’s discuss'],
      ar: ['أقل من 100 دولار', 'من 100 إلى 300 دولار', 'من 300 إلى 700 دولار', 'أكثر من 700 دولار', 'نحددها بعد النقاش'],
    },
    reference: { en: 'Reference link', ar: 'رابط مرجعي' },
    referencePlaceholder: { en: 'A video or style you like', ar: 'فيديو أو أسلوب بصري يعجبك' },
    briefHint: {
      en: 'Include the goal, audience, platform, and anything the final video must communicate.',
      ar: 'اذكر الهدف والجمهور والمنصة وأهم رسالة يجب أن يوصلها الفيديو النهائي.',
    },
    selectedCount: { en: 'selected', ar: 'محدد' },
    message: { en: 'Details', ar: 'التفاصيل' },
    messagePlaceholder: { en: 'Describe your project, goals, and timeline...', ar: 'صف مشروعك وأهدافك والجدول الزمني...' },
    sourceRef: { en: 'From', ar: 'مرجع' },
    verifyLabel: { en: 'Verification', ar: 'تحقق' },
    verifyQuestion: { en: 'What is', ar: 'كم يساوي' },
    verifyPlaceholder: { en: 'Answer', ar: 'الإجابة' },
    submit: { en: 'Send request', ar: 'إرسال الطلب' },
    sending: { en: 'Sending...', ar: 'جارٍ الإرسال...' },
    success: { en: 'Request sent! I will contact you soon.', ar: 'تم إرسال طلبك! سأتواصل معك قريبًا.' },
    errorGeneric: { en: 'Something went wrong. Please try again.', ar: 'حدث خطأ ما. حاول مرة أخرى.' },
    errorVerify: { en: 'Verification failed. Please try again.', ar: 'التحقق فشل. حاول مرة أخرى.' },
    errorRate: { en: 'Too many requests. Please try again later.', ar: 'طلبات كثيرة. حاول لاحقًا.' },
    required: { en: 'This field is required', ar: 'هذا الحقل مطلوب' },
    invalidName: {
      en: 'Enter a real name using letters only (2 to 60 characters).',
      ar: 'أدخل اسمًا حقيقيًا من حروف فقط (من حرفين إلى 60 حرفًا).',
    },
    invalidContact: {
      en: 'Enter a valid email or WhatsApp number with its country code.',
      ar: 'أدخل بريدًا صحيحًا أو رقم واتساب مع مفتاح الدولة.',
    },
    chooseOne: { en: 'Choose at least one option', ar: 'اختر خيارًا واحدًا على الأقل' },
    invalidReference: { en: 'Enter a complete link starting with http:// or https://', ar: 'أدخل رابطًا كاملًا يبدأ بـ http:// أو https://' },
  },
}

/**
 * Get a localized string from a { en, ar } object, with EN fallback.
 */
export function t(obj, lang) {
  if (!obj) return ''
  return obj[lang] || obj.en || ''
}
