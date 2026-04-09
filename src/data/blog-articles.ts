export type ArticleCategory = "autoridad" | "lifestyle" | "testimonios";

export interface BlogArticle {
  slug: string;
  title: string;
  excerpt: string;
  category: ArticleCategory;
  categoryLabel: string;
  author: string;
  publishDate: string;
  readTime: string;
  heroImage?: string;
  content: string[];
}

export const categoryLabels: Record<ArticleCategory, string> = {
  autoridad: "La Verdad sobre la Cirugía Ocular",
  lifestyle: "Lifestyle & Longevidad",
  testimonios: "Historias de Pacientes",
};

export const categoryDescriptions: Record<ArticleCategory, string> = {
  autoridad: "Información rigurosa y honesta sobre procedimientos, riesgos y estándares de calidad.",
  lifestyle: "Salud visual y calidad de vida para profesionales exigentes.",
  testimonios: "Experiencias reales de pacientes que eligieron LÚMINA.",
};

export const articles: BlogArticle[] = [
  // ── Authority Builder ──
  {
    slug: "por-que-buen-lasik-cuesta-3500-euros",
    title: "Por qué un Buen Lasik Cuesta €3.500 (Y por qué Debería Huir de las Ofertas de €900)",
    excerpt: "Desglosamos los costes reales de una cirugía refractiva segura: tecnología, experiencia del cirujano y seguimiento post-operatorio. Descubra qué se esconde detrás de los precios de franquicia.",
    category: "autoridad",
    categoryLabel: "La Verdad sobre la Cirugía Ocular",
    author: "Equipo Médico LÚMINA",
    publishDate: "2025-06-15",
    readTime: "8 min",
    content: [
      "Cuando un paciente busca 'operación Lasik Madrid', se encuentra con un rango de precios que va desde los €900 hasta los €5.000. La diferencia no es capricho. Es tecnología, experiencia y, sobre todo, seguridad.",
      "En LÚMINA utilizamos exclusivamente la plataforma Zeiss VisuMax 800, el láser femtosegundo más avanzado del mercado. Solo el mantenimiento anual de este equipo supera el coste total de muchas 'ofertas' que ve en internet.",
      "El cirujano que realiza su procedimiento tiene más de 15 años de experiencia y ha sido formado en centros de referencia europeos. En una franquicia, su caso puede ser asignado a un especialista rotante que no conoce su historial.",
      "Nuestras consultas de evaluación duran 45 minutos — frente a los 10 minutos estándar en cadenas oftalmológicas. Este tiempo adicional permite detectar contraindicaciones que un examen rápido podría pasar por alto.",
      "El seguimiento post-operatorio en LÚMINA incluye un mínimo de 5 revisiones durante el primer año, siempre con el mismo cirujano. En muchas clínicas de alto volumen, el seguimiento lo realiza un optometrista diferente cada vez.",
      "La transparencia en precios es un principio fundamental. No ofrecemos 'precios gancho' que luego se incrementan con suplementos por tecnología premium, anestesia o revisiones. El precio que le damos incluye todo.",
    ],
  },
  {
    slug: "diferencia-centro-medico-franquicia",
    title: "La Diferencia entre un 'Centro Médico' y una 'Franquicia'",
    excerpt: "No todas las clínicas oftalmológicas son iguales. Aprenda a distinguir un centro de excelencia médica de una cadena comercial con objetivos de volumen.",
    category: "autoridad",
    categoryLabel: "La Verdad sobre la Cirugía Ocular",
    author: "Equipo Médico LÚMINA",
    publishDate: "2025-06-01",
    readTime: "6 min",
    content: [
      "En el mercado oftalmológico español conviven dos modelos radicalmente distintos: el centro médico de autor y la franquicia de alto volumen. Entender la diferencia puede proteger su visión.",
      "En un centro de autor como LÚMINA, un único cirujano le acompaña desde la primera consulta hasta la última revisión. Este modelo permite una relación médico-paciente basada en la confianza y el conocimiento profundo de su caso.",
      "Las franquicias operan con un modelo de escala: maximizar el número de procedimientos diarios. Esto se traduce en consultas de 10 minutos, cirujanos rotantes y protocolos estandarizados que no siempre se adaptan a cada paciente.",
      "La inversión en tecnología también difiere. Un centro premium renueva sus equipos cada 3-5 años para mantenerse en la vanguardia. Las franquicias amortizan equipos durante décadas.",
      "Pregunte siempre: ¿Quién exactamente me operará? ¿Cuántas cirugías realiza al día? ¿Puedo contactar directamente con mi cirujano después de la operación? Las respuestas le dirán todo lo que necesita saber.",
    ],
  },
  {
    slug: "inyecciones-intravitreas-urgencia",
    title: "Inyecciones Intravítreas: Por qué Esperar 3 Semanas en la Sanidad Pública Daña su Visión",
    excerpt: "En patologías de retina, cada día cuenta. Explicamos por qué el acceso inmediato a tratamiento puede significar la diferencia entre preservar y perder visión.",
    category: "autoridad",
    categoryLabel: "La Verdad sobre la Cirugía Ocular",
    author: "Equipo Médico LÚMINA",
    publishDate: "2025-05-20",
    readTime: "7 min",
    content: [
      "La degeneración macular asociada a la edad (DMAE) húmeda y el edema macular diabético son emergencias médicas que requieren tratamiento inmediato. Cada semana de retraso puede significar pérdida irreversible de visión.",
      "En el sistema público español, los tiempos de espera para una inyección intravítrea pueden superar las 3-4 semanas. Para patologías que progresan diariamente, este plazo es médicamente inaceptable.",
      "En LÚMINA, nuestra Unidad de Preservación Macular garantiza acceso en menos de 72 horas para casos urgentes. Nuestro protocolo 'Fast Track' incluye diagnóstico con OCT de última generación y tratamiento el mismo día cuando es necesario.",
      "Utilizamos exclusivamente anti-VEGF de última generación (Faricimab, Aflibercept de alta dosis) que permiten intervalos más largos entre inyecciones, reduciendo las visitas y mejorando la calidad de vida del paciente.",
      "Si usted o un familiar ha recibido un diagnóstico de DMAE húmeda o edema macular, no espere. El tiempo es visión.",
    ],
  },

  // ── Lifestyle & Longevity ──
  {
    slug: "presbicia-ejecutivos-lentes-premium",
    title: "Presbicia: Por qué los Ejecutivos Eligen Lentes Premium para Mantenerse Competitivos",
    excerpt: "A partir de los 50, la vista cansada no es solo una molestia — es una limitación profesional. Descubra las opciones que eligen los altos directivos.",
    category: "lifestyle",
    categoryLabel: "Lifestyle & Longevidad",
    author: "Equipo Médico LÚMINA",
    publishDate: "2025-06-10",
    readTime: "5 min",
    content: [
      "La presbicia afecta al 100% de la población a partir de los 45-50 años. Para un ejecutivo, depender de gafas de lectura en reuniones, durante presentaciones o al revisar documentos en el móvil es más que una incomodidad: es una limitación competitiva.",
      "Las lentes intraoculares multifocales de última generación (como la PanOptix de Alcon o la Synergy de J&J) ofrecen visión nítida a todas las distancias, eliminando la dependencia de cualquier tipo de gafa.",
      "El procedimiento se realiza de forma ambulatoria, con anestesia local, y la recuperación funcional es de 48-72 horas. Muchos de nuestros pacientes vuelven a sus responsabilidades ejecutivas en menos de una semana.",
      "A diferencia del Lasik, que modifica la córnea, las lentes intraoculares son una solución definitiva que además previene la aparición futura de cataratas — un beneficio adicional significativo.",
      "En LÚMINA, la selección de la lente adecuada para cada paciente se basa en un estudio biométrico exhaustivo de 45 minutos, no en una recomendación genérica. Su estilo de vida profesional determina la tecnología que necesita.",
    ],
  },
  {
    slug: "blefaroplastia-rejuvenecer-mirada",
    title: "Blefaroplastia: Rejuvenecer la Mirada sin Cambiar la Expresión",
    excerpt: "La cirugía de párpados más demandada entre profesionales que quieren proyectar energía y vitalidad. Resultados naturales, sin aspecto 'operado'.",
    category: "lifestyle",
    categoryLabel: "Lifestyle & Longevidad",
    author: "Equipo Médico LÚMINA",
    publishDate: "2025-05-28",
    readTime: "4 min",
    content: [
      "Los párpados son la primera zona del rostro que revela el paso del tiempo. Una mirada cansada transmite agotamiento, incluso cuando uno está en plena forma. La blefaroplastia corrige este desfase entre cómo se siente y cómo le perciben.",
      "En LÚMINA, nuestro enfoque es 'restaurar, no transformar'. Utilizamos técnicas microquirúrgicas que eliminan el exceso de piel y las bolsas de grasa sin alterar la expresión natural de su mirada.",
      "El procedimiento se realiza con anestesia local y sedación suave. La recuperación social completa es de 7-10 días, aunque muchos pacientes retoman su actividad a los 5 días con maquillaje corrector mínimo.",
      "Es importante destacar que la blefaroplastia no es solo estética. En muchos casos, el exceso de piel en el párpado superior reduce el campo visual, convirtiendo este procedimiento en una necesidad funcional.",
    ],
  },

  // ── Patient Stories ──
  {
    slug: "historia-javier-segunda-opinion",
    title: "La Historia de Javier: Por qué Canceló su Cirugía en una Cadena para Venir a LÚMINA",
    excerpt: "Javier tenía fecha de operación en una conocida franquicia. Una segunda opinión en LÚMINA cambió completamente su plan de tratamiento — y probablemente salvó su visión.",
    category: "testimonios",
    categoryLabel: "Historias de Pacientes",
    author: "Equipo Médico LÚMINA",
    publishDate: "2025-06-12",
    readTime: "6 min",
    content: [
      "Javier, directivo de 48 años, llegó a LÚMINA con una fecha de operación Lasik programada en una conocida cadena oftalmológica de Madrid. Su consulta inicial en la cadena había durado 12 minutos.",
      "Durante nuestra evaluación de 45 minutos, detectamos una distrofia corneal incipiente que contraindicaba completamente el procedimiento Lasik. Esta condición solo se detecta con un análisis topográfico exhaustivo — un estudio que no se realizó en su consulta anterior.",
      "Le propusimos una alternativa segura: lentes ICL (Implantable Collamer Lens), un procedimiento reversible que ofrece resultados visuales superiores al Lasik en muchos casos, sin debilitar la córnea.",
      "Hoy Javier tiene una visión de 120% (mejor que la media) y nos refiere regularmente colegas de su empresa. 'La diferencia entre una consulta de 12 minutos y una de 45 minutos puede ser la diferencia entre ver bien y tener un problema serio', nos dijo en su última revisión.",
      "Esta historia ilustra la importancia de la segunda opinión en oftalmología. Un diagnóstico apresurado no solo pierde matices — puede poner en riesgo su visión de forma irreversible.",
    ],
  },
  {
    slug: "historia-carmen-retina-urgente",
    title: "Carmen: Cómo el Acceso Inmediato Preservó su Visión Central",
    excerpt: "Diagnosticada con DMAE húmeda, Carmen esperaba 4 semanas en lista de espera. En LÚMINA recibió tratamiento en 48 horas.",
    category: "testimonios",
    categoryLabel: "Historias de Pacientes",
    author: "Equipo Médico LÚMINA",
    publishDate: "2025-05-15",
    readTime: "5 min",
    content: [
      "Carmen, profesora universitaria de 67 años, notó una distorsión súbita en su visión central mientras leía. Su oftalmólogo del sistema público confirmó el diagnóstico: degeneración macular húmeda. La cita para el tratamiento: 4 semanas de espera.",
      "Alarmada por la progresión de los síntomas, Carmen contactó con nuestra Unidad de Preservación Macular. En menos de 48 horas fue evaluada con nuestro OCT de última generación y recibió su primera inyección intravítrea.",
      "Tras 3 inyecciones mensuales, el edema macular se resolvió completamente. La visión de Carmen se estabilizó en 80% — un resultado que, según la evidencia científica, habría sido significativamente peor con 4 semanas de retraso.",
      "'No quiero pensar qué habría pasado si hubiera esperado', nos dice Carmen. 'Mi visión es lo que me permite seguir enseñando, leyendo, viviendo. Cada día contaba.'",
      "El caso de Carmen no es excepcional. Atendemos semanalmente pacientes derivados del sistema público que no pueden esperar las listas de espera sin riesgo para su visión.",
    ],
  },
];

export const getArticleBySlug = (slug: string): BlogArticle | undefined =>
  articles.find((a) => a.slug === slug);

export const getArticlesByCategory = (category: ArticleCategory): BlogArticle[] =>
  articles.filter((a) => a.category === category);
