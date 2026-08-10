export type DemoPatientTag = 'Seguimiento' | 'Crónico' | 'Nuevo' | 'Alta reciente';

export type DemoPatient = {
  key: string;
  name: string;
  age: string;
  last: string;
  tag: DemoPatientTag;
  condition: string;
};

/** Roster demo (~22 pacientes) para probar búsqueda y filtros. */
export const DEMO_SPECIALIST_PATIENTS: DemoPatient[] = [
  {
    key: 'camila-soto',
    name: 'Camila Soto',
    age: '34 años',
    last: 'Control hipertensión · 12 Mar',
    tag: 'Seguimiento',
    condition: 'Hipertensión',
  },
  {
    key: 'roberto-diaz',
    name: 'Roberto Díaz',
    age: '58 años',
    last: 'Diabetes · Hoy',
    tag: 'Crónico',
    condition: 'Diabetes tipo 2',
  },
  {
    key: 'maria-jose-vera',
    name: 'María José Vera',
    age: '41 años',
    last: 'Dislipidemia · Ayer',
    tag: 'Seguimiento',
    condition: 'Dislipidemia',
  },
  {
    key: 'felipe-arancibia',
    name: 'Felipe Arancibia',
    age: '29 años',
    last: 'Primera consulta · Pendiente',
    tag: 'Nuevo',
    condition: 'Dolor abdominal',
  },
  {
    key: 'ana-contreras',
    name: 'Ana Contreras',
    age: '47 años',
    last: 'Post-operatorio · 3 Ago',
    tag: 'Alta reciente',
    condition: 'Post-cirugía',
  },
  {
    key: 'luis-herrera',
    name: 'Luis Herrera',
    age: '62 años',
    last: 'Revisión exámenes · 3 Ago',
    tag: 'Seguimiento',
    condition: 'Hipotiroidismo',
  },
  {
    key: 'patricia-nunez',
    name: 'Patricia Núñez',
    age: '36 años',
    last: 'Primera consulta · 4 Ago',
    tag: 'Nuevo',
    condition: 'Cefalea',
  },
  {
    key: 'diego-salinas',
    name: 'Diego Salinas',
    age: '51 años',
    last: 'Control crónico · 5 Ago',
    tag: 'Crónico',
    condition: 'EPOC',
  },
  {
    key: 'elena-vargas',
    name: 'Elena Vargas',
    age: '44 años',
    last: 'Seguimiento dolor · 6 Ago',
    tag: 'Seguimiento',
    condition: 'Lumbalgia',
  },
  {
    key: 'javier-moya',
    name: 'Javier Moya',
    age: '39 años',
    last: 'Control PA · 28 Jul',
    tag: 'Seguimiento',
    condition: 'Hipertensión',
  },
  {
    key: 'sofia-reyes',
    name: 'Sofía Reyes',
    age: '27 años',
    last: 'Ingreso · 1 Ago',
    tag: 'Nuevo',
    condition: 'Ansiedad',
  },
  {
    key: 'manuel-castro',
    name: 'Manuel Castro',
    age: '66 años',
    last: 'Cardiología · 22 Jul',
    tag: 'Crónico',
    condition: 'Insuficiencia cardíaca',
  },
  {
    key: 'valentina-pinto',
    name: 'Valentina Pinto',
    age: '33 años',
    last: 'Control gestacional · 30 Jul',
    tag: 'Seguimiento',
    condition: 'Control prenatal',
  },
  {
    key: 'andres-fuentes',
    name: 'Andrés Fuentes',
    age: '55 años',
    last: 'Gota · 15 Jul',
    tag: 'Crónico',
    condition: 'Hiperuricemia',
  },
  {
    key: 'carolina-bravo',
    name: 'Carolina Bravo',
    age: '48 años',
    last: 'Alta hospitalaria · 25 Jul',
    tag: 'Alta reciente',
    condition: 'Neumonía resuelta',
  },
  {
    key: 'ignacio-leal',
    name: 'Ignacio Leal',
    age: '31 años',
    last: 'Traumatología · 2 Ago',
    tag: 'Nuevo',
    condition: 'Esguince tobillo',
  },
  {
    key: 'paula-miranda',
    name: 'Paula Miranda',
    age: '52 años',
    last: 'Artritis · 18 Jul',
    tag: 'Crónico',
    condition: 'AR',
  },
  {
    key: 'tomas-aguilar',
    name: 'Tomás Aguilar',
    age: '43 años',
    last: 'Control lípidos · 20 Jul',
    tag: 'Seguimiento',
    condition: 'Dislipidemia',
  },
  {
    key: 'beatriz-soto',
    name: 'Beatriz Soto',
    age: '70 años',
    last: 'Demencia leve · 10 Jul',
    tag: 'Crónico',
    condition: 'Deterioro cognitivo',
  },
  {
    key: 'nicolas-rios',
    name: 'Nicolás Ríos',
    age: '25 años',
    last: 'Primera visita · 7 Ago',
    tag: 'Nuevo',
    condition: 'Asma',
  },
  {
    key: 'gabriela-ortiz',
    name: 'Gabriela Ortiz',
    age: '38 años',
    last: 'Migraña · 29 Jul',
    tag: 'Seguimiento',
    condition: 'Migraña',
  },
  {
    key: 'hector-paredes',
    name: 'Héctor Paredes',
    age: '60 años',
    last: 'IRC · 12 Jul',
    tag: 'Crónico',
    condition: 'Enfermedad renal',
  },
];

export const DEMO_PATIENT_TAGS: Array<DemoPatientTag | 'Todos'> = [
  'Todos',
  'Seguimiento',
  'Crónico',
  'Nuevo',
  'Alta reciente',
];
