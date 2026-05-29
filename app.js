const EUR=20.24,PLN=4.80,CZK=0.84;

const cities=[
{id:"ams",name:"Amsterdam",flag:"🇳🇱",country:"Netherlands",days:"Days 2-3 & 17-18",dates:"Mon Sep 7 – Tue Sep 8\nFri Sep 22 – Sat Sep 23",moneda:"Euro (€)",cambio:`1 € = $${EUR.toFixed(3)} USD`,
 libre:[],
 tourPersonal:"⭐ Day 17 (Fri Sep 22): If you skip Package 2 (Volendam, The Hague, Giethoorn) you have Amsterdam free. Perfect for the Rijksmuseum, Jordaan neighborhood and canals at your own pace before the Day 18 flight.",
 atractivos_itinerario:[
  ["📅 DAY 2 - Mon Sep 7","Arrival in Amsterdam · reception and hotel transfer"],
  ["Amsterdam Historic Center","UNESCO World Heritage · panoramic city tour included in the tour"],
  ["📅 DAY 3 - Tue Sep 8","Breakfast · then we head toward Hanover and Berlin"],
  ["📅 DÍA 17 — Vie 22 Sep ⭐ TOUR PERSONAL","Free time for personal activities or optional excursion"],
  ["Volendam y Marken (Package 2)","Picturesque fishing villages · wooden houses · traditional costumes (Package 2)"],
  ["La Haya — Den Haag (Package 2)","Dutch government seat · Parliament · International Court of Justice"],
  ["Pueblo de Giethoorn (Package 2)","La 'Venecia de los Países Bajos' · sin calles, solo canales · solo opera si el vuelo sale después de las 20:00 hrs"],
  ["📅 DÍA 18 — Sáb 23 Sep","Breakfast · airport transfer · return flight to Mexico"],
 ],
 atractivos_recomendados:[
  ["Rijksmuseum","museo nacional con La Ronda de Noche de Rembrandt · 2.5M visitas/año"],
  ["Casa de Ana Frank","refugio donde la familia Frank se ocultó de los nazis (1942-44)"],
  ["Museo Van Gogh","200+ obras del pintor organizadas por etapas de su vida"],
  ["Barrio Rojo (De Wallen)","zona histórica con la Oude Kerk del siglo XIII"],
  ["Barrio Jordaan","picturesque canals, markets and the Westerkerk Church"],
  ["Mercado flotante de flores (Bloemenmarkt)","único en el mundo sobre casas flotantes"],
  ["Heineken Experience","antigua fábrica interactiva con cata de cerveza incluida"],
  ["Vondelpark","el parque más visitado de Países Bajos · 10 millones de visitas/año"],
 ],
 gastronomia:[
  ["Haring","arenque crudo con cebolla y pepinillos · snack callejero icónico"],
  ["Stamppot","puré de papas con verduras y albóndigas, plato nacional"],
  ["Bitterballen","croquetas fritas de ragú de carne · aperitivo clásico de bar"],
  ["Stroopwafel","galleta doble rellena de caramelo · el dulce más icónico"],
  ["Kroket (FEBO)","croquetas en máquinas expendedoras desde €2"],
  ["Pannenkoeken","panqueques holandeses grandes, dulces o salados"],
  ["Erwtensoep","sopa espesa de guisantes con salchichas ahumadas"],
  ["Kibbeling","trozos de pescado frito con salsa de ajo"],
 ],
 restaurantes:[
  ["De Blauwe Hollander","authentic stamppot and bitterballen · Jordaan neighborhood","€10-15"],
  ["FEBO (máquinas)","croquetas, salchichas y snacks en la calle","€2-3"],
  ["HEMA Cafetería","self-service holandés · stamppot €3.50, rookworst €3.59","€3-6"],
  ["Albert Cuyp Market","market: stroopwafels, kibbeling, herring · Mon-Sat","€3-8"],
  ["Pancakes Amsterdam","panqueques holandeses en todas las variedades","€10-13"],
 ],
 video:{t:"Top Things to Do in Amsterdam - Ultimate Travel Guide 2025",d:"Canals, museums, neighborhoods and hidden gems - narrated English guide",canal:"Vacation Idea",u:"https://www.youtube.com/watch?v=8-9PyGEVYf8"},
 mapa:{centro:"Dam Square Amsterdam",url:"https://www.google.com/maps/search/?api=1&query=Dam+Square+Amsterdam+Netherlands",pois:[
  ["Plaza Dam (Dam Square)","Plaza+Dam+Amsterdam"],
  ["Amsterdam Royal Palace","Royal+Palace+Amsterdam"],
  ["Casa de Anne Frank","Anne+Frank+House+Amsterdam"],
  ["Rijksmuseum","Rijksmuseum+Amsterdam"],
  ["Museo Van Gogh","Van+Gogh+Museum+Amsterdam"],
  ["Barrio Jordaan","Jordaan+Amsterdam"],
  ["Vondelpark","Vondelpark+Amsterdam"],
  ["Mercado Albert Cuyp","Albert+Cuypmarkt+Amsterdam"],
  ["Estación Central","Amsterdam+Centraal+Station"]
 ]},
 saludos:{idioma:"Dutch (Nederlands)",nota:"Dutch is the official language. Almost everyone speaks English — but a local greeting makes a great impression and brings big smiles!",frases:[
  {cat:"🌅 Good morning",local:"Goedemorgen",pron:"HOO-duh-MOR-khen",tip:"Usa hasta aprox. las 12:00"},
  {cat:"☀️ Good afternoon",local:"Goedemiddag",pron:"HOO-duh-MIH-dahkh",tip:"Desde mediodía hasta las 18:00"},
  {cat:"🌙 Good evening",local:"Goedenavond",pron:"HOO-den-AH-vont",tip:"A partir de las 18:00"},
  {cat:"👋 Hi (informal)",local:"Hoi / Hallo",pron:"Hoy / HAH-loh",tip:"Hoi es muy cotidiano entre jóvenes"},
  {cat:"🙏 Please",local:"Alstublieft",pron:"AHL-stoo-BLEEFT",tip:"Abreviado a s.v.p. en carteles"},
  {cat:"😊 Thank you",local:"Dank u wel",pron:"DAHNK oo vel",tip:"Informal: Dank je (DAHNK yuh)"},
  {cat:"🤝 You're welcome",local:"Graag gedaan",pron:"KHRAHKH khuh-DAHN",tip:"Literally 'with pleasure'"},
  {cat:"❓ How much is it?",local:"Hoeveel kost het?",pron:"HOO-vayl kost het?",tip:"Very useful at markets and shops"},
  {cat:"🚽 Where's the restroom?",local:"Waar is het toilet?",pron:"Vahr is het twah-LET?",tip:"Toiletten en letreros"},
  {cat:"🍺 Cheers!",local:"Proost!",pron:"Prohst",tip:"Al brindar · muy usual en bares"}
 ]}
},
{id:"han",name:"Hanover",flag:"🇩🇪",country:"Germany",days:"Day 3 (transit)",dates:"Tue Sep 8 (stop on Amsterdam–Berlin route)",moneda:"Euro (€)",cambio:`1 € = $${EUR.toFixed(3)} USD`,libre:[],tourPersonal:"",
 atractivos_itinerario:[
  ["Palacio de la Ópera (Opernhaus)","uno de los teatros más importantes de Alemania"],
  ["Ruinas de la Iglesia Aegidienkirche","conservadas como memorial a las víctimas de la WWII"],
  ["Iglesia del Mercado (Marktkirche)","14th-century Gothic · symbol of the city"],
  ["Nuevo Ayuntamiento (Neues Rathaus)","con ascensor curvo único en Europa"],
  ["Viejo Ayuntamiento (Altes Rathaus)","medieval building on the historic square"],
 ],
 atractivos_recomendados:[
  ["Jardines de Herrenhausen","jardines barrocos de fama internacional · los mejores de Hannover"],
  ["Red Line tourist trail","painted route on the ground connecting 36 city attractions"],
  ["Ernst August Galerie","galería comercial frente a la estación, arquitectura destacada"],
 ],
 gastronomia:[
  ["Currywurst","salchicha con salsa curry · street food alemán clásico"],
  ["Kartoffelpuffer","tortitas de papa fritas con salsa de manzana"],
  ["Bretzel","pretzel salado · snack típico con cerveza"],
  ["Leine Bier","cerveza artesanal local emblemática de la región"],
 ],
 restaurantes:[
  ["Markthalle Hannover","covered market with many food options","€5-10"],
  ["Snack bars zona central","currywurst y pretzels en la calle","€3-5"],
  ["Restaurants en Kröpcke","central square · lunch menus","€8-13"],
 ],
 video:{t:"HANNOVER Travel Guide - Tips for visiting Hanover Germany",d:"Hanover Germany top sights and travel tips - narrated English",canal:"Budget Travel Guide",u:"https://www.youtube.com/watch?v=J77oYg8wjSc"},
 mapa:{centro:"Marktplatz Hannover",url:"https://www.google.com/maps/search/?api=1&query=Marktplatz+Hannover+Germany",pois:[
  ["Palacio de la Ópera (Opernhaus)","Opernhaus+Hannover"],
  ["Ruinas Aegidienkirche","Aegidienkirche+Hannover"],
  ["Marktkirche (Iglesia del Mercado)","Marktkirche+Hannover"],
  ["Nuevo Ayuntamiento (Neues Rathaus)","Neues+Rathaus+Hannover"],
  ["Río Leine","Leine+River+Hannover"]
 ]},
 saludos:{idioma:"German (Deutsch)",nota:"Hanoverian German is considered the purest and most neutral German in the country. Any greeting in German is warmly appreciated.",frases:[
  {cat:"🌅 Good morning",local:"Guten Morgen",pron:"GOO-ten MOR-gen",tip:"Use until about 11 am"},
  {cat:"☀️ Good afternoon",local:"Guten Tag",pron:"GOO-ten TAHK",tip:"Saludo general de día · muy común"},
  {cat:"🌙 Good evening",local:"Guten Abend",pron:"GOO-ten AH-bent",tip:"A partir de las 18:00"},
  {cat:"👋 Hi (informal)",local:"Hallo / Moin",pron:"Já-lo / Móin",tip:"Moin es típico del norte de Alemania"},
  {cat:"🙏 Please",local:"Bitte",pron:"BIT-uh",tip:"Also means 'here you go' when handing something"},
  {cat:"😊 Thank you",local:"Danke schön",pron:"DAHN-kuh shurn",tip:"Solo Danke también está bien"},
  {cat:"🤝 You're welcome",local:"Bitte sehr",pron:"BIT-uh zayr",tip:"Or simply Bitte"},
  {cat:"❓ How much is it?",local:"Was kostet das?",pron:"Vahs KOS-tet dahs?",tip:"Essential at shops and markets"},
  {cat:"🚽 Where's the restroom?",local:"Wo ist die Toilette?",pron:"Voh ist dee twah-LET-uh?",tip:"Busca WC en los letreros"},
  {cat:"🍺 Cheers!",local:"Prost!",pron:"Prohst",tip:"Clásico alemán al brindar · inevitable"}
 ]}
},
{id:"ber",name:"Berlin",flag:"🇩🇪",country:"Germany",days:"Days 3-5",dates:"Tue Sep 8 – Thu Sep 10",moneda:"Euro (€)",cambio:`1 € = $${EUR.toFixed(3)} USD`,libre:[],tourPersonal:"",
 atractivos_itinerario:[
  ["📅 DÍA 3 — Lun 8 Sep","Arrival in Berlin from Hanover · accommodation"],
  ["📅 DÍA 4 — Mar 9 Sep","Breakfast · panoramic city tour of Berlin"],
  ["Plaza Gendarmenmarkt","considered the most beautiful square in Berlin"],
  ["Puerta de Brandenburgo","global symbol of German reunification (1989)"],
  ["Potsdamer Platz","modern square with cutting-edge architecture"],
  ["Frauenkirche","church mentioned in the tour itinerary"],
  ["Palacio Zwinger","18th-century baroque · stunning architecture"],
  ["Terraza Brühl","royal promenade with river views"],
  ["Camino del Rey","historic promenade mentioned in the itinerary"],
  ["Estatua de Martín Lutero","at the Marienkirche Church"],
  ["Ciudad de Potsdam (Package 1)","Capital de Brandeburgo · Sanssouci Palace UNESCO · residencia de verano de Federico el Grande"],
  ["📅 DÍA 5 — Mié 10 Sep","Breakfast · departure to Warsaw"],
 ],
 atractivos_recomendados:[
  ["Berlin Wall (East Side Gallery)","the world's longest open-air mural · 1.3 km"],
  ["Museum Island","UNESCO Heritage with 5 world-class museums"],
  ["Holocaust Memorial","2,711 estelas de hormigón · obra de Peter Eisenman"],
  ["Reichstag","cúpula de vidrio accesible al público · vistas 360° · gratis"],
  ["Checkpoint Charlie","antiguo paso fronterizo · símbolo de la Guerra Fría"],
 ],
 gastronomia:[
  ["Döner Kebab","invented in Berlin in the 1970s · the city has the world's best"],
  ["Berlin Currywurst","sausage with curry-spiced ketchup · the city's signature dish"],
  ["Buletten","albóndigas berlinesas con pan y mostaza"],
  ["Berliner Pfannkuchen","rosquilla rellena de mermelada"],
  ["Schnitzel","filete empanizado · herencia austrohúngara"],
 ],
 restaurantes:[
  ["Mustafa's Gemüse Kebap","el döner más famoso del mundo · Mehringdamm 36","€5-6"],
  ["Markthalle Neun","mercado cubierto con street food · jueves y viernes","€5-10"],
  ["Spreewaldgrill","currywurst clásica desde 1930","€3-5"],
  ["Hackescher Markt (zona)","varied lunch menus","€9-15"],
 ],
 video:{t:"Top 10 Best Things to Do in Berlin Germany - Travel Guide 2025",d:"Berlin's top sights: Brandenburg Gate, Wall, museums and more - Jul 2025",canal:"Vacation Idea",u:"https://www.youtube.com/watch?v=QBNyYhb6Mq4"},
 mapa:{centro:"Brandenburger Tor Berlin",url:"https://www.google.com/maps/search/?api=1&query=Brandenburg+Gate+Berlin",pois:[
  ["Puerta de Brandenburgo","Brandenburg+Gate+Berlin"],
  ["Gendarmenmarkt","Gendarmenmarkt+Berlin"],
  ["Potsdamer Platz","Potsdamer+Platz+Berlin"],
  ["East Side Gallery (Muro)","East+Side+Gallery+Berlin"],
  ["Reichstag","Reichstag+Berlin"],
  ["Holocaust Memorial","Holocaust+Memorial+Berlin"],
  ["Museum Island","Museum+Island+Berlin"],
  ["Checkpoint Charlie","Checkpoint+Charlie+Berlin"],
  ["Estatua Martín Lutero","Martin+Luther+Statue+Berlin"]
 ]},
 saludos:{idioma:"German (Deutsch) · Berlin dialect",nota:"Berlin has its own accent and slang. Locals say Ick instead of Ich and have a reputation for directness — any greeting opens doors.",frases:[
  {cat:"🌅 Good morning",local:"Guten Morgen",pron:"GOO-ten MOR-gen",tip:"Berlín es ciudad de noctámbulos · no esperes caras sonrientes muy temprano"},
  {cat:"☀️ Good afternoon",local:"Guten Tag",pron:"GOO-ten TAHK",tip:"The most neutral and safe daytime greeting"},
  {cat:"🌙 Good evening",local:"Guten Abend",pron:"GOO-ten AH-bent",tip:"Useful when arriving at hotels or restaurants"},
  {cat:"👋 Hi (Berlin style)",local:"Na? / Hallo",pron:"Nah / HAH-loh",tip:"Na? (¿Qué tal?) es el saludo más berlinés"},
  {cat:"🙏 Please",local:"Bitte",pron:"BIT-uh",tip:"También sirve para decir 'aquí tiene'"},
  {cat:"😊 Thank you",local:"Danke",pron:"DAHN-kuh",tip:"Quick and effective - Berliners use it constantly"},
  {cat:"🤝 You're welcome",local:"Kein Problem",pron:"Káin Pro-blém",tip:"Literally 'no problem' - very common"},
  {cat:"❓ How much is it?",local:"Was kostet das?",pron:"Vahs KOS-tet dahs?",tip:"En Berlín hay muchos mercados de pulgas donde lo necesitarás"},
  {cat:"🚽 Where's the restroom?",local:"Wo ist die Toilette?",pron:"Voh ist dee twah-LET-uh?",tip:"En el metro se paga 50 céntimos · ten monedas"},
  {cat:"🍺 Cheers!",local:"Prost! / Zum Wohl!",pron:"Prohst / Tsoom Vohl",tip:"Berlin has Europe's best bar scene - use this often!"}
 ]}
},
{id:"var",name:"Warsaw",flag:"🇵🇱",country:"Poland",days:"Days 5-6",dates:"Thu Sep 10 – Fri Sep 11",moneda:"Polish Złoty (zł / PLN)",cambio:`1 zł = $${PLN.toFixed(3)} USD · 100 zł ≈ $${(PLN*100).toFixed(2)} USD`,libre:[],tourPersonal:"",
 atractivos_itinerario:[
  ["Old Town (Stare Miasto)","UNESCO Heritage · rebuilt stone by stone after WWII"],
  ["Castillo Real (Zamek Królewski)","residencia oficial de los reyes de Polonia"],
  ["Columna de Segismundo","iconic baroque monument facing the castle"],
  ["Iglesia de las Visitacionistas (Kościół Wizytek)","barroca · lugar donde Chopin tocó el órgano de niño"],
 ],
 atractivos_recomendados:[
  ["Warsaw Uprising Museum (1944)","homenaje a la resistencia polaca · uno de los mejores museos de Europa"],
  ["Plaza del Mercado (Rynek Starego Miasta)","rodeada de edificios coloridos del siglo XVI-XVIII"],
  ["Parque Łazienki","palacio sobre el agua y estatua de Chopin · entrada gratuita"],
  ["Praga District","alternative bohemian side of Warsaw · galleries and murals"],
 ],
 gastronomia:[
  ["Żurek","sopa agria de centeno con huevo cocido y salchicha · plato nacional"],
  ["Bigos","guiso de chucrut con carne y embutidos · el más polaco de los platos"],
  ["Pierogi ruskie","ravioles de papa y queso cottage · los más populares"],
  ["Kotlet schabowy","chuleta de cerdo empanizada · clásico polaco"],
  ["Zapiekanka","baguette con champiñones y queso gratinado · street food"],
 ],
 restaurantes:[
  ["Bar Mleczny (Bares de leche)","comedores populares · platos desde 15-25 zł","~€3-5"],
  ["Zapiekanki en Nowy Świat","street food clásico desde 10 zł (~€2)","~€2-3"],
  ["Ciudad Vieja (varios)","menús con bigos y pierogi","40+ zł (~€8+)"],
 ],
 video:{t:"Warsaw Travel Guide: 15 Experiences You Can't Forget - 72hr Itinerary",d:"72-hour Warsaw itinerary: Old Town, Royal Castle and hidden gems - Dec 2025",canal:"Travel Channel",u:"https://www.youtube.com/watch?v=axSKpiV-RNI"},
 mapa:{centro:"Plac Zamkowy Warsaw",url:"https://www.google.com/maps/search/?api=1&query=Castle+Square+Warsaw",pois:[
  ["Castillo Real (Zamek Królewski)","Royal+Castle+Warsaw"],
  ["Columna de Segismundo","Sigismund+Column+Warsaw"],
  ["Plaza del Mercado Casco Antiguo","Old+Town+Market+Place+Warsaw"],
  ["Iglesia de las Visitacionistas","Church+of+the+Visitationists+Warsaw"],
  ["Parque Lazienki","Lazienki+Park+Warsaw"],
  ["Palacio de Wilanów","Wilanow+Palace+Warsaw"],
  ["Museo POLIN","POLIN+Museum+Warsaw"],
  ["Palacio de Cultura","Palace+of+Culture+Warsaw"]
 ]},
 saludos:{idioma:"Polish (Polski)",nota:"Polish has sounds unfamiliar to English speakers — but any attempt at Polish creates enormous goodwill with locals!",frases:[
  {cat:"🌅 Good morning",local:"Dzień dobry",pron:"Jen DOH-bry",tip:"Funciona todo el día · es el saludo más seguro y formal"},
  {cat:"🌙 Good evening",local:"Dobry wieczór",pron:"DOH-bry VYEH-choor",tip:"Al llegar a un lugar por la noche"},
  {cat:"👋 Hi (informal)",local:"Cześć",pron:"Cheshch",tip:"Solo para personas de tu edad o jóvenes · muy amistoso"},
  {cat:"🙏 Please",local:"Proszę",pron:"PROH-sheh",tip:"También significa 'aquí tiene' y 'de nada'"},
  {cat:"😊 Thank you",local:"Dziękuję",pron:"Jen-KOO-yeh",tip:"Versión rápida: Dzięki (Yen-ki)"},
  {cat:"🤝 You're welcome",local:"Proszę / Nie ma za co",pron:"PROH-sheh / Nyeh-mah-ZAH-tsoh",tip:"Proszę is the most common response"},
  {cat:"❓ How much is it?",local:"Ile to kosztuje?",pron:"EE-leh toh kosh-TOO-yeh?",tip:"Muy útil en el Mercado del Casco Antiguo"},
  {cat:"🚽 Where's the restroom?",local:"Gdzie jest toaleta?",pron:"Gjeh yest toh-ah-LEH-tah?",tip:"Toaleta en letreros · a veces se paga 1-2 zł"},
  {cat:"🍺 Cheers!",local:"Na zdrowie!",pron:"Nah ZDROH-vyeh",tip:"The Polish toast - beer (piwo) is excellent and affordable"},
  {cat:"😋 Bon appétit!",local:"Smacznego!",pron:"smahch-NEH-goh",tip:"Dilo al sentarte a comer · los polacos lo aprecian mucho"}
 ]}
},
{id:"cra",name:"Kraków",flag:"🇵🇱",country:"Poland",days:"Days 6-8",dates:"Fri Sep 11 – Sun Sep 13",moneda:"Polish Złoty (zł / PLN)",cambio:`1 zł = $${PLN.toFixed(3)} USD · 100 zł ≈ $${(PLN*100).toFixed(2)} USD`,
 libre:["🟢 Day 7 — Fri Sep 12 (FREE DAY): Auschwitz-Birkenau (Package 1) · Wieliczka Salt Mines (Package 2) · or personal tour in Kraków."],
 tourPersonal:"⭐ Day 7 (Fri Sep 12): If you skip optional tours, explore the Kazimierz Quarter (the historic Jewish neighborhood full of unique cafés), the Main Market Square at your own pace, and Wawel Castle with no rush.",
 atractivos_itinerario:[
  ["📅 DAY 6 - Thu Sep 11","Breakfast · arrival from Warsaw · panoramic city tour"],
  ["Castillo de Wawel","11th-century royal fortress · supreme symbol of Poland"],
  ["Catedral de Wawel (Basílica de San Estanislao y San Wenceslao)","royal pantheon · chapels of different periods and architectural styles"],
  ["Corte Renacentista (Sukiennice)","14th-century cloth hall · now museum and souvenir shops"],
  ["Plaza del Mercado (Rynek Główny)","one of the largest medieval squares in Europe"],
  ["Basílica de Santa María (Kościół Mariacki)","Gothic with carved altar by Veit Stoss from the 15th century"],
  ["Iglesia de San Adalberto","small pre-Romanesque church from the 10th century"],
  ["📅 DAY 7 - Fri Sep 12 🟢 FREE DAY","Optional excursions or personal tour in Kraków"],
  ["Campo de concentración Auschwitz-Birkenau (Package 1)","El complejo nazi más grande · visita profundamente emotiva · monumento a las víctimas del Holocausto"],
  ["Minas de sal de Wieliczka (Package 2)","Oldest operational salt mine in the world · chapels in rock salt · Chapel of Saint Kinga · UNESCO"],
  ["📅 DAY 8 - Sat Sep 13","Breakfast · departure to Prague"],
 ],
 atractivos_recomendados:[
  ["Barrio Kazimierz","historic Jewish quarter · bohemian, full of unique galleries and cafés"],
  ["Complete Old Town (UNESCO Heritage)","walk along the medieval walls and the Barbican"],
  ["Kremówka papieska","the pastry beloved by Pope John Paul II · try it at the square"],
 ],
 gastronomia:[
  ["Obwarzanek krakowski","braided ring bread · Kraków's gastronomic icon since 1400"],
  ["Kraków-style Pierogi","local version with various fillings · considered the best in Poland"],
  ["Oscypek","queso ahumado de oveja típico de la región de Małopolska"],
  ["Żurek w chlebie","sopa servida dentro de un pan de centeno hueco"],
  ["Kremówka papieska","pastel de crema que adoraba Juan Pablo II de niño"],
 ],
 restaurantes:[
  ["Bares Mleczny (varios)","platos completos 15-30 zł · auténticos y económicos","€3-6"],
  ["Puestos obwarzanek (plaza)","rosquilla desde 2-3 zł por unidad","€0.40"],
  ["Restaurantes Kazimierz","ambiente bohemio · menús 35-50 zł","€7-10"],
  ["Starka Restauracja","cocina tradicional polaca · muy valorado","€10-18"],
 ],
 video:{t:"20 Things You Need to Know Before Visiting Krakow in 2026",d:"Essential Krakow tips: food, transport, Auschwitz, Jewish Quarter - Mar 2026",canal:"Before You Go",u:"https://www.youtube.com/watch?v=CUSx7CRFoIo"},
 mapa:{centro:"Rynek Glowny Krakow",url:"https://www.google.com/maps/search/?api=1&query=Main+Market+Square+Krakow",pois:[
  ["Castillo de Wawel","Wawel+Castle+Krakow"],
  ["Catedral de Wawel","Wawel+Cathedral+Krakow"],
  ["Basílica de Santa María","St+Marys+Basilica+Krakow"],
  ["Plaza del Mercado (Rynek Główny)","Rynek+Glowny+Krakow"],
  ["Lonja de los Paños (Sukiennice)","Sukiennice+Krakow"],
  ["Iglesia de San Adalberto","St+Adalbert+Church+Krakow"],
  ["Barrio Judío Kazimierz","Kazimierz+Krakow"],
  ["Fábrica de Schindler","Schindler+Factory+Krakow"],
  ["Auschwitz-Birkenau","Auschwitz+Birkenau+Memorial"],
  ["Minas de sal Wieliczka","Wieliczka+Salt+Mine"]
 ]},
 saludos:{idioma:"Polish (Polski) · Małopolska accent",nota:"Kraków has the oldest and most melodic Polish accent. Cracovians are warmer than Varsovians — any Polish attempt earns big smiles!",frases:[
  {cat:"🌅 Good morning",local:"Dzień dobry",pron:"Jen DOH-bry",tip:"El saludo estrella · funciona a toda hora · formal y siempre correcto"},
  {cat:"🌙 Good evening",local:"Dobry wieczór",pron:"DOH-bry VYEH-choor",tip:"Al entrar a un restaurante o bar por la noche"},
  {cat:"👋 Hi (informal)",local:"Cześć",pron:"Cheshch",tip:"Con jóvenes y en ambiente informal · suena a 'honor' en latín"},
  {cat:"🙏 Please",local:"Proszę",pron:"PROH-sheh",tip:"Irremplazable · úsalo al pedir cualquier cosa"},
  {cat:"😊 Thank you",local:"Dziękuję bardzo",pron:"Jen-KOO-yeh BAR-dzoh",tip:"Bardzo = mucho · para expresar gratitud mayor"},
  {cat:"🤝 You're welcome",local:"Nie ma za co",pron:"Nyeh-mah-ZAH-tsoh",tip:"Literally 'don't mention it'"},
  {cat:"❓ How much is it?",local:"Ile to kosztuje?",pron:"EE-leh toh kosh-TOO-yeh?",tip:"Imprescindible en el Mercado Stary Kleparz"},
  {cat:"🚽 Where's the restroom?",local:"Gdzie jest toaleta?",pron:"Gjeh yest toh-ah-LEH-tah?",tip:"En la Plaza del Mercado hay baños públicos cerca del Cloth Hall"},
  {cat:"🍺 Cheers!",local:"Na zdrowie!",pron:"Nah ZDROH-vyeh",tip:"Kraków has excellent craft beer bars - use this freely"},
  {cat:"😋 Bon appétit!",local:"Smacznego!",pron:"smahch-NEH-goh",tip:"Especialmente útil antes de probar los pierogi · plato local icónico"}
 ]}
},
{id:"pra",name:"Prague",flag:"🇨🇿",country:"Czech Republic",days:"Days 8-10",dates:"Sun Sep 13 – Mon Sep 15",moneda:"Czech Koruna (Kč / CZK)",cambio:`1 Kč = $${CZK.toFixed(3)} USD · 100 Kč ≈ $${(CZK*100).toFixed(2)} USD`,
 libre:["🟢 Day 9 — Sun Sep 14 (FREE DAY): Vltava River Cruise (Package 1) · Karlovy Vary or Czech Night with Dinner (Package 2) · or personal tour."],
 tourPersonal:"⭐ Day 9 (Sun Sep 14): No optional tours? Visit Prague Castle on your own (not included in Day 8 panoramic tour), cross Charles Bridge at sunrise when it's empty, and explore Malá Strana at your leisure.",
 atractivos_itinerario:[
  ["📅 DAY 8 - Sat Sep 13","Breakfast · arrival from Kraków · panoramic tour morning and afternoon"],
  ["Plaza Václav Havel (Wenceslas Square)","one of Prague's largest squares · historic central boulevard"],
  ["Plaza de la Ciudad Vieja","between Wenceslas Square and Charles Bridge (Karlův Most)"],
  ["Torre del Reloj Astronómico","bells every hour · built in 1410"],
  ["Iglesia de Tyn","14th-century Gothic · iconic on the Old Town Square"],
  ["Ayuntamiento Viejo","home of the famous astronomical clock"],
  ["Iglesia de San Nicolás","mencionada en el itinerario · 18th-century baroque"],
  ["Monumento a Jan Hus","on Old Town Square · 15th-century Czech reformer"],
  ["Puente de Carlos (Karlův Most)","built in the 14th century · 30 baroque statues"],
  ["📅 DAY 9 - Sun Sep 14 🟢 FREE DAY","Optional excursions or personal tour in Prague"],
  ["Paseo en barco por el Río Moldava (Package 1)","Boat cruise · passes under Charles Bridge · views of Prague Castle"],
  ["Karlovy Vary Excursion (Package 2)","Elegant spa resort · 12 thermal springs · frequented by royalty and celebrities"],
  ["Noche checa con cena tradicional (Package 2)","Traditional Czech dinner · folk music · typical dances · local wine or beer"],
  ["📅 DAY 10 - Mon Sep 15","Breakfast · departure to Nuremberg"],
 ],
 atractivos_recomendados:[
  ["Prague Castle","the largest castle complex in the world · dominates the city from the hill"],
  ["Barrio Judío (Josefov)","6 sinagogas históricas y cementerio del siglo XII"],
  ["Malá Strana Quarter","baroque houses at the foot of the castle · very photogenic"],
  ["Kafka Museum","tribute to the writer born in Prague in 1883"],
 ],
 gastronomia:[
  ["Svíčková na smetaně","filete de ternera en salsa de crema con knedlíky (dumplings)"],
  ["Vepřo-knedlo-zelo","cerdo asado con chucrut y knedlíky · plato nacional checo"],
  ["Trdelník","masa en palo asada con azúcar y canela · street food"],
  ["Guláš checo","similar al húngaro · con pan o dumplings"],
  ["Smažený sýr","queso frito empanizado · el favorito del pueblo checo"],
  ["Svařák","vino caliente con especias · perfecto en septiembre"],
 ],
 restaurantes:[
  ["Lokál (varios locales)","cocina checa auténtica · Pilsner Urquell fresca","~€8-15"],
  ["Malá Strana (zona)","menús con gulash y svíčková desde 200 Kč","~€8-12"],
  ["Puestos de trdelník (plaza)","80-100 Kč por unidad","~€3-4"],
  ["Havelské tržiště","mercado histórico · frutas y snacks","€2-6"],
 ],
 video:{t:"Prague Travel Guide 2025 - Must-See Spots! Walking Tour",d:"Full walking tour through Prague's magical streets and landmarks - Aug 2025",canal:"Travel Guide",u:"https://www.youtube.com/watch?v=BOyinB6qB9E"},
 mapa:{centro:"Old Town Square Prague",url:"https://www.google.com/maps/search/?api=1&query=Old+Town+Square+Prague",pois:[
  ["Plaza Václav Havel","Wenceslas+Square+Prague"],
  ["Plaza de la Ciudad Vieja","Old+Town+Square+Prague"],
  ["Reloj Astronómico","Prague+Astronomical+Clock"],
  ["Iglesia de Týn","Tyn+Church+Prague"],
  ["Ayuntamiento Viejo","Old+Town+Hall+Prague"],
  ["Iglesia de San Nicolás","St+Nicholas+Church+Prague"],
  ["Monumento a Jan Hus","Jan+Hus+Memorial+Prague"],
  ["Puente de Carlos","Charles+Bridge+Prague"],
  ["Prague Castle","Prague+Castle"],
  ["Catedral de San Vito","St+Vitus+Cathedral+Prague"],
  ["Muro de John Lennon","Lennon+Wall+Prague"]
 ]},
 saludos:{idioma:"Czech (Čeština)",nota:"Czech is a Slavic language with stress on the first syllable. Czechs may seem reserved at first — trying their language changes everything!",frases:[
  {cat:"🌅 Good morning",local:"Dobré ráno",pron:"DOH-breh RAH-noh",tip:"Only until about 10 am"},
  {cat:"☀️ Good afternoon",local:"Dobré odpoledne",pron:"DOH-breh OD-poh-led-neh",tip:"Desde mediodía · algo formal"},
  {cat:"🌙 Good evening",local:"Dobrou noc",pron:"DOH-broh nots",tip:"Al despedirse por la noche"},
  {cat:"👋 Hola (todo el día)",local:"Dobrý den",pron:"DOH-bree den",tip:"El más versátil · saludo formal de día completo"},
  {cat:"👋 Hi (informal)",local:"Ahoj",pron:"AH-hoy",tip:"Informal y amistoso · igual al español 'ahoy'"},
  {cat:"🙏 Please",local:"Prosím",pron:"PROH-seem",tip:"También 'aquí tiene' y respuesta a 'gracias'"},
  {cat:"😊 Thank you",local:"Děkuji",pron:"DJEH-koo-yee",tip:"Informal: Díky (DEE-kee) - very common"},
  {cat:"🤝 You're welcome",local:"Prosím / Není zač",pron:"PROH-seem / NEH-nee zahch",tip:"Prosím is the most common response"},
  {cat:"❓ How much is it?",local:"Kolik to stojí?",pron:"KOH-lik toh STOH-yee?",tip:"Esencial · Praga tiene muchos mercados y souvenir"},
  {cat:"🚽 Where's the restroom?",local:"Kde je toaleta?",pron:"Gdeh yeh toh-ah-LEH-tah?",tip:"WC en letreros · se paga 10-20 Kč en muchos sitios"},
  {cat:"🍺 Cheers!",local:"Na zdraví!",pron:"Nah ZDRAH-vee",tip:"¡Imprescindible! Praga tiene la mejor cerveza del mundo · mira a todos los ojos al brindar"}
 ]}
},
{id:"nur",name:"Nuremberg",flag:"🇩🇪",country:"Germany",days:"Days 10-12",dates:"Mon Sep 15 – Wed Sep 17",moneda:"Euro (€)",cambio:`1 € = $${EUR.toFixed(3)} USD`,
 libre:["🟢 Day 11 — Tue Sep 16 (FREE DAY): Rothenburg ob der Tauber (Package 1) · Munich (Package 2) · or personal tour."],
 tourPersonal:"⭐ Day 11 (Tue Sep 16): No optional tours? Nuremberg offers the Nuremberg Trials Courthouse (Room 600 where Nazi war criminals were judged), the 3-mile walkable medieval walls, and the Imperial Castle — all within walking distance.",
 atractivos_itinerario:[
  ["📅 DAY 10 - Mon Sep 15","Breakfast · arrival from Prague · city tour"],
  ["Imperial Castle of Nuremberg (Kaiserburg)","built on a hilltop about a thousand years ago · living core of the city"],
  ["Iglesia de Nuestra Señora (Frauenkirche)","Gothic on the Hauptmarkt · clock with mechanical figures"],
  ["Casa de la Ópera (Opernhaus)","Nuremberg Opera House · mentioned in the tour itinerary"],
  ["Viejo Ayuntamiento (Altes Rathaus)","with visitable medieval dungeons"],
  ["Río Pegnitz","fascinating views of the river crossing the medieval center"],
  ["📅 DAY 11 - Tue Sep 16 🟢 FREE DAY","Optional excursions or personal tour in Nuremberg"],
  ["Ciudad Rothenburg ob der Tauber (Package 1)","Best-preserved medieval city in Germany · walls · half-timbered houses · Romantic Road"],
  ["Ciudad de Múnich (Package 2)","Capital of Bavaria · Oktoberfest · Marienplatz · New Town Hall · beer culture"],
  ["📅 DAY 12 - Wed Sep 17","Breakfast · departure to Frankfurt"],
 ],
 atractivos_recomendados:[
  ["Ciudad Vieja amurallada","murallas medievales casi intactas de 5 km · caminables completas"],
  ["Nuremberg Trials Courthouse (Room 600)","where Nazi war crimes were judged in 1945-46 · visitable"],
  ["Hauptmarkt","plaza central · famosa por el Christkindlesmarkt navideño"],
  ["Museo Nacional Germánico","el mayor de arte y cultura germanoparlante del mundo"],
 ],
 gastronomia:[
  ["Nürnberger Bratwürste","las salchichas más famosas de Alemania · diminutas a la parrilla"],
  ["Schäufele","paleta de cerdo asada con chucrut y dumpling de papa"],
  ["Lebkuchen","pan de jengibre especiado · el más famoso de Europa"],
  ["Elisen-Lebkuchen","premium version of lebkuchen · IGP-protected specialty of Nuremberg"],
 ],
 restaurantes:[
  ["Bratwurst Röslein (Hauptmarkt)","bratwürste tradicionales en la plaza central","€8-14"],
  ["Heilig-Geist-Spital","restaurante histórico junto al río","€12-20"],
  ["Puestos Hauptmarkt","salchichas y lebkuchen en la calle","€3-6"],
 ],
 video:{t:"Ultimate Nuremberg Germany Travel Guide - Best Things to See & Do",d:"Germany's most magical fairytale city? Full narrated guide - Oct 2025",canal:"Travel Guide",u:"https://www.youtube.com/watch?v=0O2Eg7cW_Wo"},
 mapa:{centro:"Hauptmarkt Nuremberg",url:"https://www.google.com/maps/search/?api=1&query=Hauptmarkt+Nuremberg",pois:[
  ["Castillo Imperial","Nuremberg+Castle"],
  ["Iglesia de Nuestra Señora (Frauenkirche)","Frauenkirche+Nuremberg"],
  ["Casa de la Ópera","Nuremberg+Opera+House"],
  ["Ayuntamiento Viejo","Old+Town+Hall+Nuremberg"],
  ["Río Pegnitz","Pegnitz+River+Nuremberg"],
  ["Plaza Hauptmarkt","Hauptmarkt+Nuremberg"],
  ["Iglesia de San Lorenzo","St+Lorenz+Church+Nuremberg"],
  ["Casa de Albrecht Dürer","Albrecht+Durer+House+Nuremberg"],
  ["Rothenburg ob der Tauber","Rothenburg+ob+der+Tauber"]
 ]},
 saludos:{idioma:"German (Deutsch) · Franconian-Bavarian dialect",nota:"Nuremberg is in Franconia, a region with its own dialect. Standard German works perfectly — but local expressions earn warm smiles.",frases:[
  {cat:"🌅 Good morning",local:"Guten Morgen",pron:"GOO-ten MOR-gen",tip:"Standard German - always correct"},
  {cat:"☀️ Good afternoon",local:"Guten Tag",pron:"GOO-ten TAHK",tip:"The most neutral daytime greeting"},
  {cat:"🌙 Good evening",local:"Guten Abend",pron:"GOO-ten AH-bent",tip:"Desde las 18:00 · al entrar a restaurantes"},
  {cat:"👋 Hola (franco)",local:"Grüß Gott",pron:"Grooss Gott",tip:"Saludo bávaro-franco tradicional · literalmente 'Dios te salude'"},
  {cat:"👋 Hi (casual southern)",local:"Servus",pron:"ZAIR-voos",tip:"Typical southern Germany - warm and friendly"},
  {cat:"🙏 Please",local:"Bitte",pron:"BIT-uh",tip:"Universal throughout Germany"},
  {cat:"😊 Thank you",local:"Danke schön",pron:"DAHN-kuh shurn",tip:"Local dialect: Vergelt's Gott (fair-GELTS Gott)"},
  {cat:"🤝 You're welcome",local:"Gern geschehen",pron:"Gern je-shé-en",tip:"With pleasure - warmer than just Bitte"},
  {cat:"❓ How much is it?",local:"Was kostet das?",pron:"Vahs KOS-tet dahs?",tip:"Para el mercado del Castillo y la Ciudad Vieja"},
  {cat:"🚽 Where's the restroom?",local:"Wo ist die Toilette?",pron:"Voh ist dee twah-LET-uh?",tip:"Busca WC en los letreros medievales"},
  {cat:"🍺 Cheers!",local:"Prost!",pron:"Prohst",tip:"With a Nürnberger Bratwurst and Franconian beer - the complete experience!"}
 ]}
},
{id:"fra",name:"Frankfurt",flag:"🇩🇪",country:"Germany",days:"Days 12-13",dates:"Wed Sep 17 – Thu Sep 18",moneda:"Euro (€)",cambio:`1 € = $${EUR.toFixed(3)} USD`,libre:[],tourPersonal:"",
 atractivos_itinerario:[
  ["📅 DAY 12 - Wed Sep 17","Breakfast · arrival from Nuremberg · Frankfurt city visit"],
  ["Edificios de la familia Römer (ss.XIII-XIV)","the most photogenic historic town hall in Frankfurt"],
  ["Iglesia de San Nicolás","next to the Römerberg · mentioned in the itinerary"],
  ["Catedral Imperial de San Bartolomé","coronation site of Holy Roman Emperors"],
  ["Banco Central Europeo (BCE)","majestic silhouette mentioned in the itinerary"],
  ["Banco de Alemania (Deutsche Bundesbank)","one of the most important financial institutions in the world"],
  ["Bolsa de Frankfurt (Börse)","famous bull and bear statues outside"],
  ["Paseo nocturno en barco por el Río Meno (Package 2)","Evening boat cruise · contrast between historic Römer and financial skyline"],
  ["📅 DAY 13 - Thu Sep 18","Breakfast · departure to Luxembourg and Metz"],
 ],
 atractivos_recomendados:[
  ["Römerberg (plaza histórica)","corazón turístico medieval de Frankfurt · muy fotogénico"],
  ["Museumsufer","orilla del Main con 12 museos en fila · Städel Art Museum imperdible"],
  ["Kleinmarkthalle","mercado cubierto del siglo XIX con productos regionales únicos"],
  ["Skyline financiero","la silueta más única de Alemania · rascacielos junto al casco medieval"],
 ],
 gastronomia:[
  ["Grüne Soße","salsa fría de 7 hierbas locales · plato símbolo de Frankfurt"],
  ["Handkäse mit Musik","queso fuerte con cebolla en vinagre y comino"],
  ["Frankfurter Würstchen","la salchicha frankfurt original · en mostaza con pan"],
  ["Äppelwoi","sidra de manzana ácida local · la bebida de Frankfurt"],
  ["Rippchen mit Kraut","costillas de cerdo curadas con chucrut"],
 ],
 restaurantes:[
  ["Kleinmarkthalle (Hasengasse 5-7)","mercado gourmet · quesos, embutidos, tapas","€3-8"],
  ["Sachsenhausen (cider district)","Äppelwoi and Handkäse · authentic local atmosphere","€3-10"],
  ["Zum Gemalten Haus","sidrería clásica con Grüne Soße casera","€10-18"],
 ],
 video:{t:"Best Things to Do in Frankfurt Germany - First Timers Guide",d:"Frankfurt travel guide with all the best sights for first-time visitors - Feb 2026",canal:"Travel Vlog",u:"https://www.youtube.com/watch?v=sBv7Zdp1NEg"},
 mapa:{centro:"Römerberg Frankfurt",url:"https://www.google.com/maps/search/?api=1&query=Romerberg+Frankfurt",pois:[
  ["Römerberg (Plaza Römer)","Romerberg+Frankfurt"],
  ["Iglesia de San Nicolás","St+Nicholas+Church+Frankfurt"],
  ["Catedral Imperial (Dom)","Frankfurt+Cathedral"],
  ["Banco Central Europeo","European+Central+Bank+Frankfurt"],
  ["Bolsa de Frankfurt","Frankfurt+Stock+Exchange"],
  ["Río Meno","Main+River+Frankfurt"],
  ["Main Tower","Main+Tower+Frankfurt"],
  ["Museo Städel","Stadel+Museum+Frankfurt"],
  ["Casa de Goethe","Goethe+House+Frankfurt"],
  ["Barrio Sachsenhausen","Sachsenhausen+Frankfurt"]
 ]},
 saludos:{idioma:"German (Deutsch) · Hessian dialect",nota:"Frankfurt is Germany's most cosmopolitan city — English is widely spoken especially in finance. The local dialect is Hessisch but standard German is perfect.",frases:[
  {cat:"🌅 Good morning",local:"Guten Morgen",pron:"GOO-ten MOR-gen",tip:"Frankfurt madruga mucho — ciudad financiera"},
  {cat:"☀️ Good afternoon",local:"Guten Tag",pron:"GOO-ten TAHK",tip:"Safe and formal throughout the day"},
  {cat:"🌙 Good evening",local:"Guten Abend",pron:"GOO-ten AH-bent",tip:"Al llegar al Sachsenhausen para cenar"},
  {cat:"👋 Hi (Hessian local)",local:"Guude!",pron:"GOO-duh",tip:"Frankfurt's signature greeting - very local and appreciated"},
  {cat:"👋 Hi (informal)",local:"Hallo / Hey",pron:"Já-lo / Jey",tip:"En bares y zonas jóvenes del Sachsenhausen"},
  {cat:"🙏 Please",local:"Bitte",pron:"BIT-uh",tip:"Múltiple uso: pedir, agradecer y dar"},
  {cat:"😊 Thank you",local:"Danke",pron:"DAHN-kuh",tip:"Rápido y efectivo · en el dialecto local: Merci (francés adoptado)"},
  {cat:"🤝 You're welcome",local:"Bitte sehr",pron:"BIT-uh zayr",tip:"With pleasure - polite and correct"},
  {cat:"❓ How much is it?",local:"Was kostet das?",pron:"Vahs KOS-tet dahs?",tip:"Útil en el mercado del Römer y tiendas del Zeil"},
  {cat:"🚽 Where's the restroom?",local:"Wo ist die Toilette?",pron:"Voh ist dee twah-LET-uh?",tip:"Los baños del aeropuerto son los mejores de Europa"},
  {cat:"🍺 Cheers!",local:"Prost! / Ebbelwei!",pron:"Prost / É-bel-vai",tip:"Ebbelwei es la sidra de manzana de Frankfurt · brinda con ella en el Sachsenhausen"}
 ]}
},
{id:"lux",name:"Luxembourg",flag:"🇱🇺",country:"Grand Duchy of Luxembourg",days:"Day 13 (excursion) & 14",dates:"Thu Sep 18 – Fri Sep 19",moneda:"Euro (€)",cambio:`1 € = $${EUR.toFixed(3)} USD`,
 libre:["Day 14 — Fri Sep 19: Luxembourg City is an optional excursion from Package 1 from Metz (34 mi · 45 min by train)."],
 tourPersonal:"⭐ Day 14 (Fri Sep 19): Skipping the Luxembourg excursion? You can go independently from Metz by train (€10-15 round trip). Luxembourg City is very walkable and fully explorable in one day.",
 atractivos_itinerario:[
  ["City of Luxembourg (optional Package 1 excursion)","UNESCO Heritage · included in the optional tour"],
  ["Ciudad de Schengen (Package 2)","Donde se firmó el Acuerdo de Schengen (1985) que abolió los controles fronterizos en Europa"],
 ],
 atractivos_recomendados:[
  ["Old Quarter and Pétrusse Valley","city above deep valleys · unique views"],
  ["Bock Casemates","túneles defensivos del siglo XVII abiertos al público"],
  ["Palacio Gran Ducal","residencia oficial del Gran Duque · en el centro histórico"],
  ["Puente Adolphe","art nouveau sobre el valle · vistas espectaculares"],
  ["Place d'Armes","plaza central animada con terrazas"],
 ],
 gastronomia:[
  ["Judd mat Gaardebounen","smoked pork collar with broad beans · Luxembourg's national dish"],
  ["Gromperekichelcher","buñuelos de papa callejeros · los más populares"],
  ["Quetschentaart","tarta de ciruelas · postre tradicional luxemburgués"],
  ["Vino Mosela luxemburgués","blancos secos producidos junto al río Mosela"],
 ],
 restaurantes:[
  ["Place d'Armes (brasseries)","menús del día en la plaza central","€12-20"],
  ["Grund (barrio bajo)","restaurantes junto al río Alzette · más económicos","€10-15"],
  ["Mercado cubierto (Knuedler)","quesos, embutidos y productos locales","€5-10"],
 ],
 video:{t:"Luxembourg: Europe's Richest Country! Top 10 Things To Do",d:"Old Town, Bock Casemates, Corniche and more - narrated English - Feb 2026",canal:"Travel Guide",u:"https://www.youtube.com/watch?v=1jsQXl3i82M"},
 mapa:{centro:"Place Guillaume II Luxembourg",url:"https://www.google.com/maps/search/?api=1&query=Place+Guillaume+II+Luxembourg+City",pois:[
  ["Plaza Guillaume II","Place+Guillaume+II+Luxembourg"],
  ["Bock Casemates","Bock+Casemates+Luxembourg"],
  ["Palacio Gran Ducal","Grand+Ducal+Palace+Luxembourg"],
  ["Catedral Notre-Dame","Notre+Dame+Cathedral+Luxembourg"],
  ["Puente Adolphe","Adolphe+Bridge+Luxembourg"],
  ["Chemin de la Corniche","Chemin+de+la+Corniche+Luxembourg"],
  ["Casco Antiguo","Luxembourg+Old+Quarter"],
  ["Schengen","Schengen+Luxembourg"]
 ]},
 saludos:{idioma:"Luxembourgish (Lëtzebuergesch) · French · German",nota:"Luxembourg has 3 official languages: Luxembourgish, French and German. Everyone speaks all three. French is most practical — but a Luxembourgish greeting is something truly special!",frases:[
  {cat:"🌅 Good morning (Lux.)",local:"Gudde Moien",pron:"GOO-duh MOY-en",tip:"El saludo más especial que puedes dar · úsalo y verás las caras de sorpresa"},
  {cat:"☀️ Buenos días (fr.)",local:"Bonjour",pron:"Bohn-ZHOOR",tip:"Safe and universal throughout the city"},
  {cat:"🌙 Good evening (French)",local:"Bonsoir",pron:"Bohn-SWAHR",tip:"A partir de las 18:00"},
  {cat:"👋 Hi (Luxembourgish)",local:"Moien",pron:"MOY-en",tip:"Muy coloquial · los luxemburgueses lo usan entre ellos todo el día"},
  {cat:"🙏 Please (French)",local:"S'il vous plaît",pron:"Seel-voo-PLAY",tip:"Essential at shops and cafés"},
  {cat:"😊 Thank you",local:"Merci",pron:"Mair-SEE",tip:"They use French Merci - same in all 3 languages"},
  {cat:"🤝 You're welcome (French)",local:"De rien / Je vous en prie",pron:"De ryen / Ye vuz on prí",tip:"De rien en casual · Je vous en prie en formal"},
  {cat:"❓ ¿Cuánto cuesta? (fr.)",local:"Combien ça coûte?",pron:"Kohm-BYAN sah KOOT?",tip:"En el mercado Guillaume o tiendas del casco"},
  {cat:"🚽 Restroom? (French)",local:"Où sont les toilettes?",pron:"Ú son le twá-let?",tip:"Pregunta en cualquier café con confianza"},
  {cat:"🍺 Cheers!",local:"Prost! / Santé!",pron:"Prost / San-té",tip:"Prost del alemán y Santé del francés · los dos son correctos"}
 ]}
},
{id:"met",name:"Metz",flag:"🇫🇷",country:"France (Lorraine)",days:"Days 13-15 (base city)",dates:"Thu Sep 18 – Sat Sep 20",moneda:"Euro (€)",cambio:`1 € = $${EUR.toFixed(3)} USD`,
 libre:["🟢 Day 14 — Fri Sep 19 (FREE DAY): Strasbourg/Colmar (Pkg.1) · Luxembourg (Pkg.1) · Schengen (Pkg.2) · or explore Metz on your own."],
 tourPersonal:"⭐ Day 14 (Fri Sep 19): No excursions? Metz itself offers Saint-Étienne Cathedral (one of the world's largest expanses of medieval stained glass), the Centre Pompidou-Metz, and the Temple Quarter — all walkable in a very pleasant day.",
 atractivos_itinerario:[
  ["📅 DAY 13 - Thu Sep 18","Breakfast · arrival from Frankfurt · free time for optional excursions"],
  ["City of Luxembourg (Package 1)","Grand Duchy capital · Casemates UNESCO · one of Europe's financial and political centers"],
  ["Ciudad de Schengen (Package 2)","Donde se firmó el Acuerdo de Schengen (1985) que abolió los controles fronterizos en Europa"],
  ["Metz / Thionville as base city","accommodation during days 13-15"],
  ["📅 DAY 14 - Fri Sep 19 🟢 FREE DAY","Optional excursions or free exploration of Metz"],
  ["Strasbourg (Package 1)","Gothic cathedral · seat of European Parliament · excursion with Colmar (Package 1)"],
  ["Colmar (Package 1)","Fairy-tale architecture · 'Little Venice' quarter · excursion together with Strasbourg (Package 1)"],
  ["📅 DAY 15 - Sat Sep 20","Breakfast · departure to Brussels"],
 ],
 atractivos_recomendados:[
  ["Catedral de San Esteban de Metz","gótica con los vitrales medievales más grandes del mundo · impresionante"],
  ["Centre Pompidou-Metz","museo de arte moderno satélite del de París · arquitectura espectacular"],
  ["Barrio del Temple","medieval con pequeños canales y plazas encantadoras"],
  ["Place de la République","plaza central animada con terrazas y mercado"],
  ["Isla del Saulcy","campus universitario en una isla del Mosela · paseo agradable"],
 ],
 gastronomia:[
  ["Quiche Lorraine","tarta de tocino y crema · originaria exactamente de esta región"],
  ["Mirabelles de Lorena","ciruelas amarillas locales · septiembre es su temporada perfecta"],
  ["Pâté Lorrain","hojaldre relleno de carne marinada · especialidad regional única"],
  ["Vino de Mosela","blancos y tintos de la región de Lorena"],
 ],
 restaurantes:[
  ["Marchés couverts de Metz","quiches, embutidos y productos locales","€5-10"],
  ["Winstubs del centro","bistrós alsacianos · quiche y vino","€10-16"],
  ["Place Saint-Jacques (zona)","plaza central · menús del día variados","€10-16"],
 ],
 video:{t:"One Day In Metz France - Top Things to Do & See Walking Tour",d:"Walking tour: cathedral, Pompidou, Porte des Allemands - Aug 2025",canal:"Travel Guide",u:"https://www.youtube.com/watch?v=ahY6ipxtJN8"},
 mapa:{centro:"Place dArmes Metz",url:"https://www.google.com/maps/search/?api=1&query=Place+darmes+Metz+France",pois:[
  ["Catedral de Saint-Étienne","Saint+Etienne+Cathedral+Metz"],
  ["Place d'Armes","Place+darmes+Metz"],
  ["Place Saint-Louis","Place+Saint+Louis+Metz"],
  ["Centre Pompidou-Metz","Centre+Pompidou+Metz"],
  ["Puerta Imperial Alemana","Porte+des+Allemands+Metz"],
  ["Jardín de la Esplanada","Esplanade+Metz"],
  ["Río Mosela","Moselle+River+Metz"],
  ["Estrasburgo","Strasbourg+France"],
  ["Colmar","Colmar+France"]
 ]},
 saludos:{idioma:"French (Français) · Lorraine",nota:"Metz is in the Lorraine region, bordering Germany and Luxembourg. French is the daily language — Lorrainers really appreciate the effort to speak it!",frases:[
  {cat:"🌅 Good morning",local:"Bonjour",pron:"Bohn-ZHOOR",tip:"El saludo más importante en Francia · siempre primero que cualquier pregunta"},
  {cat:"🌙 Good evening",local:"Bonsoir",pron:"Bohn-SWAHR",tip:"A partir de las 18:00 · en restaurantes y tiendas"},
  {cat:"👋 Hi (informal)",local:"Salut",pron:"Sah-LOO",tip:"Solo con personas de confianza o jóvenes · nunca a desconocidos"},
  {cat:"🙏 Please",local:"S'il vous plaît",pron:"Seel-voo-PLAY",tip:"Obligatorio antes de pedir cualquier cosa · sin esto pueden ignorarte"},
  {cat:"😊 Thank you",local:"Merci beaucoup",pron:"Mair-SEE boh-KOO",tip:"Beaucoup = mucho · solo Merci también está perfecto"},
  {cat:"🤝 You're welcome",local:"De rien / Avec plaisir",pron:"Duh ree-EN / Ah-vek pleh-ZEER",tip:"Avec plaisir es más cálido · con mucho gusto"},
  {cat:"❓ How much is it?",local:"Combien ça coûte?",pron:"Kohm-BYAN sah KOOT?",tip:"En el mercado Place de la Cathédrale o tiendas locales"},
  {cat:"🚽 Where's the restroom?",local:"Où sont les toilettes?",pron:"Ú son le twá-let?",tip:"French don't say 'salle de bain' for public restrooms"},
  {cat:"🍺 Cheers!",local:"Santé!",pron:"Sahn-TAY",tip:"Obligatorio mirar a los ojos · no hacerlo trae mala suerte según la tradición francesa"},
  {cat:"😋 Bon appétit!",local:"Bon appétit!",pron:"Bohn ah-pay-TEE",tip:"Dilo al sentarte · los franceses lo dicen antes de cada comida"}
 ]}
},
{id:"bru",name:"Brussels",flag:"🇧🇪",country:"Belgium",days:"Days 15-17",dates:"Sat Sep 20 – Mon Sep 22",moneda:"Euro (€)",cambio:`1 € = $${EUR.toFixed(3)} USD`,
 libre:["🟢 Day 16 — Sun Sep 21 (FREE DAY): Bruges and Ghent (Package 1) · or Brussels on your own."],
 tourPersonal:"Day 16 (Sun Sep 21): Skipping Bruges/Ghent? Brussels offers the Atomium, the Royal Museums of Fine Arts (Magritte, Bruegel, Rubens) and the European Quarter — all walkable from the city center.",
 atractivos_itinerario:[
  ["📅 DAY 15 - Sat Sep 20","Breakfast · arrival from Metz · Brussels city tour"],
  ["Grand Place (Plaza Mayor)","UNESCO Heritage · considered the most beautiful square in the world"],
  ["Galerías Reales de Saint-Hubert","19th-century neoclassical commercial arcade"],
  ["Manneken Pis","iconic sculpture and symbol of Brussels"],
  ["Brussels Royal Palace","official residence of the Belgian king"],
  ["Museos Reales de Bellas Artes","Bruegel, Rubens and Magritte under one roof"],
  ["📅 DAY 16 - Sun Sep 21 🟢 FREE DAY","Optional excursions or Brussels on your own"],
  ["Cities of Bruges and Ghent (Package 1)","Bruges: 'Venice of the North' · medieval canals · Flemish architecture. Ghent: medieval castle · vibrant city"],
  ["📅 DAY 17 - Mon Sep 22","Breakfast · departure to Amsterdam"],
 ],
 atractivos_recomendados:[
  ["Atomium","iron structure in the shape of an atom · Expo 1958 · Brussels icon"],
  ["Barrio Europeo","sede de la Comisión Europea y el Parlamento Europeo"],
  ["Catedral de San Miguel y Santa Gúdula","gótica del siglo XIII · impresionante interior"],
  ["Barrio de las Marolles","popular con mercado de antigüedades Place du Jeu de Balle"],
 ],
 gastronomia:[
  ["Brussels Waffles","rectangular crispy waffle · the authentic one is from street stalls"],
  ["Moules-frites","mejillones al vapor con papas fritas · plato nacional belga"],
  ["Carbonade flamande","estofado de ternera a la cerveza belga · profundo y sabroso"],
  ["Chocolate belga","Godiva, Neuhaus, Leonidas · los mejores del mundo"],
  ["Cerveza belga","1,500+ variedades: Trappist, Gueuze, Lambic, Dubbel"],
  ["Frites belges","papas fritas en cono con mayonesa · las más crujientes de Europa"],
 ],
 restaurantes:[
  ["Friterie Antoine (Place Jourdan)","the most famous fries in Brussels","€4-6"],
  ["Rue du Marché aux Fromages","calle de menús mediterráneos variados","€8-13"],
  ["Mercado de Midi (domingos)","el mayor mercado de Bélgica · quesos, panes","€3-8"],
  ["Moeder Lambic (St-Gilles)","400+ cervezas artesanales con tapas","€5-12"],
 ],
 video:{t:"Brussels Belgium - Full Travel Guide 2025",d:"Grand Place, chocolate, beer, Atomium and the best of Brussels - May 2025",canal:"Travel Channel",u:"https://www.youtube.com/watch?v=xL4s1imrVKU"},
 mapa:{centro:"Grand Place Brussels",url:"https://www.google.com/maps/search/?api=1&query=Grand+Place+Brussels",pois:[
  ["Grand Place (Plaza Mayor)","Grand+Place+Brussels"],
  ["Galerías Saint-Hubert","Galeries+Saint+Hubert+Brussels"],
  ["Manneken Pis","Manneken+Pis+Brussels"],
  ["Palacio Real","Royal+Palace+Brussels"],
  ["Museos Reales de Bellas Artes","Royal+Museums+of+Fine+Arts+Brussels"],
  ["Atomium","Atomium+Brussels"],
  ["Museo Magritte","Magritte+Museum+Brussels"],
  ["Mont des Arts","Mont+des+Arts+Brussels"],
  ["Mini-Europe","Mini+Europe+Brussels"],
  ["Brujas","Bruges+Belgium"],
  ["Gante","Ghent+Belgium"]
 ]},
 saludos:{idioma:"French (Français) · Dutch (Nederlands)",nota:"Brussels is officially bilingual — French is more commonly used in practice. Belgians are famous for being kind and tolerant with foreigners who try their language.",frases:[
  {cat:"🌅 Good day (French)",local:"Bonjour",pron:"Bohn-ZHOOR",tip:"The greeting that opens all doors in Brussels"},
  {cat:"🌙 Good evening (French)",local:"Bonsoir",pron:"Bohn-SWAHR",tip:"Al llegar a restaurantes o bares por la noche"},
  {cat:"👋 Hi (Belgian)",local:"Dag / Bonjour",pron:"Dahkh / Bohn-ZHOOR",tip:"Dag es el saludo neerlandés · muy usado en Bruselas también"},
  {cat:"🙏 Please (French)",local:"S'il vous plaît",pron:"Seel-voo-PLAY",tip:"Esencial antes de pedir cualquier cosa · los belgas son muy formales"},
  {cat:"😊 Thank you (French)",local:"Merci",pron:"Mair-SEE",tip:"Brussels also accepts Dutch Dank u (DAHNK oo)"},
  {cat:"😊 Thank you (Dutch)",local:"Dank u wel",pron:"DAHNK oo vel",tip:"Usar esto en Bruselas sorprende y agrada mucho"},
  {cat:"🤝 You're welcome",local:"De rien / Graag gedaan",pron:"Duh ree-EN / KHRAHKH khuh-DAHN",tip:"Francés o neerlandés según el idioma en que hables"},
  {cat:"❓ ¿Cuánto cuesta? (fr.)",local:"Combien ça coûte?",pron:"Kohm-BYAN sah KOOT?",tip:"Para el mercado de la Grand Place y chocolate belga"},
  {cat:"🚽 ¿Dónde está el baño? (fr.)",local:"Où sont les toilettes?",pron:"Ú son le twá-let?",tip:"Many Belgian bars have restrooms for customers only"},
  {cat:"🍺 Cheers!",local:"Santé! / Proost!",pron:"San-té / Próost",tip:"Bélgica tiene más de 1,500 cervezas · merece un brindis especial"},
  {cat:"🍫 ¡Esto está delicioso!",local:"C'est délicieux!",pron:"Say day-lee-SYUH",tip:"Dilo al probar el chocolate belga · es la verdad absoluta"}
 ]}
},
];

const tourPkgs=[
{id:"p1",label:"Package 1 — $679 USD",tours:[
 {id:"pot",name:"Potsdam",flag:"🇩🇪",base:"From Berlin · 35 km · 35 min",
  desc:"Capital of the state of Brandenburg. Famous for its impressive palaces and gardens, especially Sanssouci Palace, summer residence of Frederick the Great, and a UNESCO World Heritage Site.",
  atractivos:[
   ["Sanssouci Palace","UNESCO Heritage · summer residence of Frederick the Great (18th century)"],
   ["Palacio Cecilienhof","donde se firmó el Tratado de Potsdam (agosto 1945)"],
   ["Palacio Nuevo (Neues Palais)","el mayor del conjunto · barroco prusiano"],
   ["Parque Sanssouci","300 hectáreas de jardines y palacios interconectados"],
   ["Barrio Hollandisches Viertel","casas de estilo holandés del s.XVIII · fotogénico"],
  ],
  gastronomia:["Same German cuisine as Berlin (30 km away)","Cafés near the park with a more refined atmosphere than Berlin"]
 },
 {id:"aus",name:"Auschwitz-Birkenau",flag:"🇵🇱",base:"From Kraków · 75 km · 1h 15min",
  desc:"The largest Nazi concentration and extermination camp complex. A deeply moving and historic visit, considered a monument to the victims of the Holocaust.",
  atractivos:[
   ["Campo Auschwitz I","campo principal con la entrada 'Arbeit Macht Frei'"],
   ["Campo Auschwitz II-Birkenau","el mayor campo de exterminio · ruinas de cámaras de gas y hornos"],
   ["Museo Estatal","uno de los sitios históricos más visitados del mundo"],
   ["Holocaust Memorial","Moving tribute to victims of the Holocaust"],
  ],
  gastronomia:["Visita memorial · llevar agua y snack · no hay servicios de restauración","Pueblo de Oświęcim a 2 km con restaurantes polacos básicos"]
 },
 {id:"mol",name:"Barco Río Moldava",flag:"🇨🇿",base:"Prague city center",
  desc:"Un tranquilo recorrido en barco que ofrece una perspectiva única de Praga, pasando bajo el Puente de Carlos y brindando vistas panorámicas del Prague Castle y otros monumentos importantes de la ciudad.",
  atractivos:[
   ["Crucero panorámico por el Moldava","vistas del Puente de Carlos desde el agua"],
   ["Prague Castle visto desde el río","perspectiva única que no se logra desde tierra"],
   ["15 historic bridges in the center","seen from below during the cruise"],
   ["Opción nocturna disponible","crucero de noche con puentes y castillo iluminados"],
  ],
  gastronomia:["Algunos cruceros incluyen cena checa o bebidas a bordo","Opciones de crucero-cena con música tradicional bohemia"]
 },
 {id:"rot",name:"Rothenburg ob der Tauber",flag:"🇩🇪",base:"From Nuremberg · 100 km · 1h",
  desc:"One of the best-preserved medieval cities in Germany, famous for its walls, half-timbered houses and fairy-tale atmosphere. Part of the Romantic Road.",
  atractivos:[
   ["Murallas medievales del s.XIV","3.5 km caminables en perfecto estado de conservación"],
   ["Market Square and Rathaus","Renaissance town hall with panoramic city views"],
   ["Kriminalmuseum","museo de justicia medieval con instrumentos de tortura"],
   ["Käthe Wohlfahrt","la tienda de navidad más famosa del mundo · abierta todo el año"],
   ["El Guardián Nocturno","tour vespertino guiado por las murallas · muy popular"],
  ],
  gastronomia:["Schneeballen: bolas de masa frita espolvoreadas · el dulce local icónico","Cordero y cerdo asado con recetas franconias en la plaza medieval"]
 },
 {id:"lxp",name:"City of Luxembourg",flag:"🇱🇺",base:"From Metz · 55 km · 45 min",
  desc:"Capital of the Grand Duchy of Luxembourg. Known for its historic fortifications (the 'casemates'), its deep gorges, and its role as one of Europe's financial and political centers.",
  atractivos:[
   ["Bock Casemates","21 km of underground tunnels carved into rock · UNESCO Heritage"],
   ["Old Quarter (Ville Haute)","UNESCO Heritage · perfectly preserved medieval alleyways"],
   ["Palacio Gran Ducal","residencia oficial del Gran Duque · cambio de guardia"],
   ["Puente Adolphe","1903 stone bridge · city symbol · views over the gorge"],
   ["Chemin de la Corniche","'el balcón más bello de Europa' · vistas panorámicas sobre el Alzette"],
  ],
  gastronomia:["Judd mat Gaardebounen: cuello de cerdo ahumado con habas · plato nacional luxemburgués","Vinos Mosela luxemburgueses en bodegas del centro · blancos secos excelentes","Gromperekichelcher: tortitas de papa especiadas · street food típico"]
 },
 {id:"str",name:"Estrasburgo y Colmar",flag:"🇫🇷",base:"From Metz · 215 km · 2h",
  desc:"Strasbourg is famous for its Gothic cathedral and as the seat of the European Parliament. Colmar es una joya pintoresca conocida por su arquitectura de cuento y el barrio de la 'Pequeña Venecia'.",
  atractivos:[
   ["Catedral de Notre-Dame (Estrasburgo)","gótica del s.XIV · 142 m · una de las más altas del mundo"],
   ["Petite France Quarter (Strasbourg)","canals and medieval half-timbered houses · UNESCO Heritage"],
   ["Parlamento Europeo (Estrasburgo)","sede del PE · visitable con cita previa"],
   ["Barrio Petite Venise (Colmar)","canales con casas alsacianas de cuento · muy fotogénico"],
   ["Museo Unterlinden (Colmar)","con el Retablo de Issenheim de Grünewald (s.XVI)"],
  ],
  gastronomia:["Choucroute garnie: chucrut con embutidos y papas · plato regional definitivo","Flammekueche (Tarte flambée): pizza alsaciana con crema, cebolla y lardons","Kougelhopf: bizcocho alsaciano con almendras y pasas · ideal para llevar"]
 },
 {id:"brug",name:"Brujas y Gante",flag:"🇧🇪",base:"Bruges: 60 mi (1h) · Ghent: 34 mi (35min) from Brussels",
  desc:"Brujas es conocida como la 'Venecia del Norte', famosa por sus canales, plazas medievales y arquitectura flamenca. Gante es una ciudad vibrante con un impresionante castillo medieval y un rico pasado.",
  atractivos:[
   ["Brujas — Canales y casco histórico","la 'Venecia del Norte' · Patrimonio UNESCO completo"],
   ["Belfry de Brujas (Belfort)","torre del s.XIII · 366 escalones · vistas únicas sobre la ciudad"],
   ["Begijnhof de Brujas","complejo monástico medieval junto al lago del amor"],
   ["Gante — Castillo de los Condes (Gravensteen)","fortaleza medieval del s.IX perfectamente conservada"],
   ["Catedral de San Bavón (Gante)","con el Políptico del Cordero Místico de Van Eyck (s.XV)"],
  ],
  gastronomia:["Brujas: chocolate artesanal en tiendas independientes desde €3","Gante: Gentse Stoverij, estofado de ternera a la cerveza local","Gaufres de Lieja (esponjosas con perlas de azúcar) en puestos callejeros"]
 },
]},
{id:"p2",label:"Package 2 — $669 USD",tours:[
 {id:"wie",name:"Minas Wieliczka",flag:"🇵🇱",base:"From Kraków · 15 km · 20 min",
  desc:"One of the oldest operational salt mines in the world, famous for its impressive chambers, underground lakes, and chapels carved entirely from rock salt, including the Chapel of St. Kinga.",
  atractivos:[
   ["Wieliczka Salt Mines","Patrimonio UNESCO · operativas desde el siglo XIII"],
   ["Capilla de Santa Kinga","esculpida completamente en sal · una de las obras más sorprendentes del mundo"],
   ["Lagos subterráneos","a 135 metros de profundidad · efecto espejo increíble"],
   ["300 km de galerías en 9 niveles","visita guiada de 2-3 horas · escala impresionante"],
  ],
  gastronomia:["Restaurante subterráneo dentro de la mina · experiencia única","Comida polaca en el pueblo de Wieliczka antes o después de la visita"]
 },
 {id:"kv",name:"Karlovy Vary",flag:"🇨🇿",base:"Desde Praga · 130 km · 1h 30min",
  desc:"A famous and elegant spa town known for its twelve thermal springs. Historically frequented by royalty and celebrities — an ideal place for relaxation and strolling along its colonnades.",
  atractivos:[
   ["Colonadas y 12 fuentes termales","cada fuente con agua a diferente temperatura · icónicas"],
   ["Mlýnská kolonáda","la colonada más imponente del balneario · neorrenacentista"],
   ["Colina del castillo","vistas panorámicas sobre el valle de los ríos"],
   ["Moser Glass Factory","fábrica de cristal de Bohemia del s.XIX · visitable"],
  ],
  gastronomia:["Becherovka: licor herbáceo destilado aquí desde 1807 · imperdible","Oplatky: obleas azucaradas rellenas · el souvenir gastronómico del balneario"]
 },
 {id:"mun",name:"Múnich",flag:"🇩🇪",base:"From Nuremberg · 170 km · 1h 45min",
  desc:"Capital of Bavaria, famous for Oktoberfest, its elegant squares (Marienplatz), historic buildings like the New Town Hall, and its rich beer culture.",
  atractivos:[
   ["Marienplatz y Nuevo Ayuntamiento","reloj glockenspiel que toca a las 11h y 17h"],
   ["Englischer Garten","el parque urbano más grande del mundo · mayor que Central Park"],
   ["Hofbräuhaus","cervecería histórica del s.XVI · la más famosa de Baviera"],
   ["Museo Alemán (Deutsches Museum)","el mayor museo de ciencia y tecnología del mundo"],
   ["Frauenkirche","twin-tower cathedral · symbol of Munich"],
  ],
  gastronomia:["Weisswurst: salchicha blanca bávara · se sirve antes del mediodía con pretzel y mostaza dulce","Schweinshaxe: codillo de cerdo a la parrilla · el plato bávaro más contundente","Pretzel gigante con Obatzda (crema de queso bávara) en las cervecerías"]
 },
 {id:"noc",name:"Noche Checa con cena",flag:"🇨🇿",base:"In Prague",
  desc:"A nighttime cultural experience that typically includes a traditional Czech dinner accompanied by folk music, typical dances, and local wine or beer.",
  atractivos:[
   ["Cena tradicional checa","svíčková, guláš y knedlíky en ambiente de época"],
   ["Música folclórica checa en vivo","canciones y danzas típicas de Bohemia"],
   ["Bailes típicos checos","demostración y participación incluidas"],
   ["Cerveza checa de barril","Pilsner Urquell, Kozel o Budvar directamente de la fuente"],
  ],
  gastronomia:["Full Czech cuisine menu included · 3 courses + drinks","Intimate atmosphere in a historic Old Town Prague restaurant"]
 },
 {id:"bar",name:"Barco Río Meno (Frankfurt)",flag:"🇩🇪",base:"In Frankfurt",
  desc:"A cruise on the Main River that lets you appreciate Frankfurt's contrast: from the historic Römer center to the impressive skyline of financial skyscrapers.",
  atractivos:[
   ["Crucero nocturno por el río Meno","contraste entre el Römerberg medieval y los rascacielos financieros"],
   ["Vistas del skyline de Frankfurt","la silueta más única de Alemania vista desde el agua"],
   ["Puentes históricos del centro","iluminados de noche durante el crucero"],
  ],
  gastronomia:["Algunos cruceros incluyen aperitivo de Äppelwoi (sidra local) a bordo","Disponible aperitivo ligero con bocadillos francofortianos"]
 },
 {id:"sch",name:"City of Schengen",flag:"🇱🇺",base:"From Metz · 60 km · 50 min",
  desc:"Un pequeño pueblo que es mundialmente conocido por ser el lugar where the Schengen Agreement was signed in 1985, que abolió los controles fronterizos entre los países europeos signatarios.",
  atractivos:[
   ["Espacio Schengen (Museo)","donde se firmó el Acuerdo Schengen (1985) que abolió las fronteras internas europeas"],
   ["Schengen Monument","on the banks of the Moselle · where France, Luxembourg and Germany meet"],
   ["Paseo por el río Mosela","viñedos y paisaje pittoresco de la región"],
  ],
  gastronomia:["Vino Mosela luxemburgués en bodegas locales · blancos secos excelentes","Pueblo pequeño con un par de restaurantes de cocina regional"]
 },
 {id:"vol",name:"Volendam, Marken y La Haya",flag:"🇳🇱",base:"From Amsterdam: Volendam 14 mi · The Hague 37 mi",
  desc:"Volendam and Marken are picturesque fishing villages known for their wooden houses and traditional costumes. The Hague is the seat of the Dutch government and home of the International Court of Justice.",
  atractivos:[
   ["Volendam","pueblo pesquero con casas de madera y trajes tradicionales holandeses"],
   ["Marken","isla-pueblo con casas verdes sobre pilotes · muy fotogénico"],
   ["La Haya (Den Haag)","sede del gobierno neerlandés y la Corte Internacional de Justicia"],
   ["Mauritshuis (La Haya)","museo con La Joven de la Perla de Vermeer"],
  ],
  gastronomia:["Haring fresco en Volendam directamente del puerto · el más fresco del país","Stroopwafels artesanales en mercados locales","Poffertjes (mini panqueques con mantequilla) en puestos de Volendam"]
 },
]},
];

const distMain=[
 {de:"Amsterdam",a:"Hanover",mi:174,t:"2h 30min"},
 {de:"Hannover",a:"Berlin",mi:179,t:"2h 45min"},
 {de:"Berlin",a:"Warsaw",mi:357,t:"5h 30min"},
 {de:"Warsaw",a:"Kraków",mi:186,t:"3h 00min"},
 {de:"Kraków",a:"Prague",mi:336,t:"5h 15min"},
 {de:"Prague",a:"Nuremberg",mi:224,t:"3h 30min"},
 {de:"Nuremberg",a:"Frankfurt",mi:143,t:"2h 15min"},
 {de:"Frankfurt",a:"Luxembourg",mi:137,t:"2h 15min"},
 {de:"Luxembourg",a:"Metz",mi:34,t:"45min"},
 {de:"Metz",a:"Brussels",mi:193,t:"3h 00min"},
 {de:"Brussels",a:"Amsterdam",mi:130,t:"2h 00min"},
];
const distTours=[
 {de:"Berlin",a:"Potsdam",mi:22,t:"35min"},
 {de:"Kraków",a:"Auschwitz-Birkenau",mi:47,t:"1h 15min"},
 {de:"Kraków",a:"Wieliczka Salt Mines",mi:9,t:"20min"},
 {de:"Nuremberg",a:"Rothenburg ob der Tauber",mi:62,t:"1h 00min"},
 {de:"Nuremberg",a:"Munich",mi:106,t:"1h 45min"},
 {de:"Metz",a:"Strasbourg",mi:134,t:"2h 00min"},
 {de:"Strasbourg",a:"Colmar",mi:47,t:"45min"},
 {de:"Metz",a:"City of Schengen",mi:37,t:"50min"},
 {de:"Prague",a:"Karlovy Vary",mi:81,t:"1h 30min"},
 {de:"Brussels",a:"Ghent",mi:34,t:"30min"},
 {de:"Brussels",a:"Bruges",mi:59,t:"1h 00min"},
 {de:"Amsterdam",a:"Volendam/Marken",mi:14,t:"25min"},
 {de:"Amsterdam",a:"The Hague",mi:37,t:"50min"},
];

let curView='home',curCity=0,curSub='itinerario',curPkg=0,curTour=0;

function sv(v){
 curView=v;
 document.querySelectorAll('.view').forEach(e=>e.classList.remove('active'));
 document.querySelectorAll('.nav-btn').forEach(e=>e.classList.remove('active'));
 document.getElementById('view-'+v).classList.add('active');
 document.getElementById('nav-'+v).classList.add('active');
 if(v==='ciudades')renderCities();
 if(v==='tours')renderTours();
 if(v==='dist')renderDist();
 if(v==='monedas')renderMonedas();
}

function renderCities(){
 document.getElementById('city-pills').innerHTML=cities.map((c,i)=>
  `<button class="pill${i===curCity?' active':''}" onclick="selC(${i})">${c.flag} ${c.name}</button>`
 ).join('');
 const tabs=[['itinerario','📋 From the Itinerary'],['recomendados','⭐ Recommended'],['gastronomia','🍽️ Local Cuisine'],['restaurantes','🍴 Where to Eat'],['saludos','🗣️ Greetings'],['mapa','🗺️ Map'],['fotos','📸 Photos'],['documentos','📄 Documents'],['video','📺 Video']];
 document.getElementById('sub-pills').innerHTML=tabs.map(s=>
  `<button class="subpill${curSub===s[0]?' active':''}" onclick="selS('${s[0]}')">${s[1]}</button>`
 ).join('');
 renderCityBody();
}

function renderCityBody(){
 const c=cities[curCity];let h='';
 if(c.libre.length) h+=`<div class="libre-box"><p>🗓️ ${c.libre[0]}</p></div>`;
 if(c.tourPersonal) h+=`<div class="tp-box"><div class="tpt">🌟 Suggested Personal Tour</div><p>${c.tourPersonal}</p></div>`;
 if(curSub==='itinerario'){
  h+=`<div class="card"><div class="card-header"><div class="card-title">${c.flag} ${c.name}</div><div class="card-sub">${c.country} · ${c.days}<br><span style="color:var(--gold)">${c.dates}</span></div><div class="tag">${c.moneda} · ${c.cambio}</div></div>`;
  h+=`<div class="section-label">Included in the tour</div>`;
  h+=c.atractivos_itinerario.map(a=>{
   const isDay=a[0].startsWith('📅');
   const isLibre=a[0].includes('🟢');
   if(isDay&&isLibre) return `<div class="day-header day-libre">${a[0]}<div style="font-size:12px;font-weight:400;margin-top:2px;opacity:.85">${a[1]}</div></div>`;
   if(isDay) return `<div class="day-header">${a[0]}<div style="font-size:12px;font-weight:400;margin-top:2px;opacity:.85">${a[1]}</div></div>`;
   return `<div class="list-item"><span class="lb">◆</span><div class="list-text">${a[0]}<div class="list-sub">${a[1]}</div></div></div>`;
  }).join('');
  h+='</div>';
  h+=renderNotes(c.id,'itinerario');
 } else if(curSub==='recomendados'){
  h+=`<div class="card"><div class="card-header"><div class="card-title">⭐ Additional Recommendations</div><div class="card-sub">Not included in the tour · visit on your own during free time</div></div>`;
  h+=`<div class="section-label">Additional recommended attractions</div>`;
  h+=c.atractivos_recomendados.map(a=>`<div class="list-item"><span class="lb2">◇</span><div class="list-text">${a[0]}<div class="list-sub">${a[1]}</div></div></div>`).join('');
  h+='</div>';
  h+=renderNotes(c.id,'recomendados');
 } else if(curSub==='gastronomia'){
  h+=`<div class="card"><div class="card-header"><div class="card-title">🍽️ Local Cuisine</div></div>`;
  h+=c.gastronomia.map(g=>`<div class="list-item"><span class="lb">◆</span><div class="list-text">${g[0]}<div class="list-sub">${g[1]}</div></div></div>`).join('');
  h+='</div>';
  h+=renderNotes(c.id,'gastronomia');
 } else if(curSub==='restaurantes'){
  h+=`<div class="card"><div class="card-header"><div class="card-title">🍴 Dónde comer económico</div></div>`;
  h+=c.restaurantes.map(r=>`<div class="rest-row"><div style="flex:1"><div class="rname">${r[0]}</div><div class="rdesc">${r[1]}</div></div><span class="rprice">${r[2]}</span></div>`).join('');
  h+='</div>';
  h+=renderNotes(c.id,'restaurantes');
 } else if(curSub==='saludos'){
  const s=c.saludos;
  h+=`<div class="card"><div class="card-header"><div class="card-title">🗣️ Useful Phrases in ${s.idioma}</div><div class="card-sub">${s.nota}</div></div>`;
  h+=s.frases.map(f=>`<div class="saludo-row"><div class="saludo-cat">${f.cat}</div><div class="saludo-local">${f.local}</div><div class="saludo-pron">🔊 <em>${f.pron}</em></div><div class="saludo-tip">💡 ${f.tip}</div></div>`).join('');
  h+='</div>';
 } else if(curSub==='mapa'){
  const m=c.mapa;
  h+=`<div class="card"><div class="card-header"><div class="card-title">🗺️ Mapa de ${c.name}</div><div class="card-sub">Tap any spot to open in Google Maps</div></div>`;
  h+=`<a class="vlink" href="${m.url}" target="_blank" rel="noopener" style="background:rgba(201,168,76,0.08)"><div class="pbtn" style="background:var(--gold);color:#0f1923">📍</div><div style="flex:1"><div class="vtitle">View ${c.name} overview map</div><div class="vdesc">Opens Google Maps on the historic district</div></div></a>`;
  h+=`<div class="section-label">📌 Tour Itinerary Spots</div>`;
  h+=m.pois.map(p=>`<a class="map-poi" href="https://www.google.com/maps/search/?api=1&query=${p[1]}" target="_blank" rel="noopener"><span class="poi-icon">📍</span><div class="poi-name">${p[0]}</div><span class="poi-arrow">↗</span></a>`).join('');
  h+='</div>';
 } else if(curSub==='fotos'){
  h+=renderFotos(c.id,c.name);
 } else if(curSub==='documentos'){
  h+=renderDocumentos(c.id,c.name);
 } else if(curSub==='video'){
  h+=`<div class="card"><div class="card-header"><div class="card-title">📺 Best YouTube Travel Guide</div><div class="card-sub">In English · top-rated narrated guide for this city</div></div>`;
  h+=`<a class="vlink" href="${c.video.u}" target="_blank"><div class="pbtn">▶</div><div><div class="vtitle">${c.video.t}</div><div class="vdesc">${c.video.d}</div><div style="font-size:12px;color:var(--gold);margin-top:4px">Channel: ${c.video.canal}</div></div></a></div>`;
 }
 document.getElementById('city-body').innerHTML=h;
}

// ========= NOTES SYSTEM =========
function getNotes(cityId,section){
 try{
  const raw=localStorage.getItem('notes_'+cityId+'_'+section);
  return raw?JSON.parse(raw):[];
 }catch(e){return [];}
}
function saveNotes(cityId,section,arr){
 try{localStorage.setItem('notes_'+cityId+'_'+section,JSON.stringify(arr));}catch(e){}
}
function renderNotes(cityId,section){
 const notes=getNotes(cityId,section);
 const sectionTitle={itinerario:'itinerary',recomendados:'recommended',gastronomia:'local cuisine',restaurantes:'where to eat'}[section]||section;
 let h='<div class="card notes-card">';
 h+=`<div class="card-header"><div class="card-title">📝 My notes - ${sectionTitle}</div><div class="card-sub">On this phone only · ${notes.length} ${notes.length===1?'note':'notes'}</div></div>`;
 if(notes.length){
  h+=notes.map((n,i)=>`<div class="note-row"><div class="note-content">${escapeHtml(n.text)}<div class="note-date">${n.date}</div></div><button class="note-del" onclick="delNote('${cityId}','${section}',${i})">🗑</button></div>`).join('');
 } else {
  h+=`<div style="padding:12px 14px;font-size:13px;color:var(--dim);text-align:center">No notes added yet</div>`;
 }
 h+=`<div class="note-add">
  <textarea id="note-input-${cityId}-${section}" placeholder="Write a note (restaurant tip, visited place, etc.)" rows="2"></textarea>
  <button class="note-add-btn" onclick="addNote('${cityId}','${section}')">➕ Add note</button>
 </div>`;
 h+='</div>';
 return h;
}
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'})[c]);}
function addNote(cityId,section){
 const ta=document.getElementById('note-input-'+cityId+'-'+section);
 if(!ta)return;
 const text=ta.value.trim();
 if(!text)return;
 const notes=getNotes(cityId,section);
 const now=new Date();
 const dateStr=now.toLocaleDateString('es-MX',{day:'numeric',month:'short'})+' · '+now.toLocaleTimeString('es-MX',{hour:'2-digit',minute:'2-digit'});
 notes.push({text:text,date:dateStr});
 saveNotes(cityId,section,notes);
 renderCityBody();
}
function delNote(cityId,section,idx){
 if(!confirm('Delete this note?'))return;
 const notes=getNotes(cityId,section);
 notes.splice(idx,1);
 saveNotes(cityId,section,notes);
 renderCityBody();
}

// ========= PHOTOS SYSTEM (IndexedDB) =========
// IndexedDB handles large binary data better than localStorage (which has ~5MB limit)
let photoDB=null;
function openPhotoDB(){
 return new Promise((resolve,reject)=>{
  if(photoDB){resolve(photoDB);return;}
  const req=indexedDB.open('europa_photos',1);
  req.onerror=()=>reject(req.error);
  req.onupgradeneeded=e=>{
   const db=e.target.result;
   if(!db.objectStoreNames.contains('photos')){
    const store=db.createObjectStore('photos',{keyPath:'id',autoIncrement:true});
    store.createIndex('cityId','cityId',{unique:false});
   }
  };
  req.onsuccess=()=>{photoDB=req.result;resolve(photoDB);};
 });
}
async function getPhotos(cityId){
 try{
  const db=await openPhotoDB();
  return new Promise((resolve)=>{
   const tx=db.transaction('photos','readonly');
   const store=tx.objectStore('photos');
   const idx=store.index('cityId');
   const req=idx.getAll(cityId);
   req.onsuccess=()=>resolve(req.result||[]);
   req.onerror=()=>resolve([]);
  });
 }catch(e){return [];}
}
async function savePhoto(cityId,dataUrl,caption){
 const db=await openPhotoDB();
 return new Promise((resolve,reject)=>{
  const tx=db.transaction('photos','readwrite');
  const store=tx.objectStore('photos');
  const now=new Date();
  const dateStr=now.toLocaleDateString('es-MX',{day:'numeric',month:'short',year:'numeric'});
  const photo={cityId:cityId,data:dataUrl,caption:caption||'',date:dateStr,ts:Date.now()};
  const req=store.add(photo);
  req.onsuccess=()=>resolve(req.result);
  req.onerror=()=>reject(req.error);
 });
}
async function delPhoto(id){
 const db=await openPhotoDB();
 return new Promise((resolve)=>{
  const tx=db.transaction('photos','readwrite');
  tx.objectStore('photos').delete(id);
  tx.oncomplete=()=>resolve(true);
  tx.onerror=()=>resolve(false);
 });
}
// Compress image to max 1200px and JPEG quality 0.78
function compressImage(file){
 return new Promise((resolve,reject)=>{
  const reader=new FileReader();
  reader.onerror=()=>reject(reader.error);
  reader.onload=e=>{
   const img=new Image();
   img.onerror=()=>reject(new Error('Image load failed'));
   img.onload=()=>{
    const MAX=1200;
    let w=img.width,hT=img.height;
    if(w>MAX||hT>MAX){
     if(w>hT){hT=Math.round(hT*MAX/w);w=MAX;}
     else{w=Math.round(w*MAX/hT);hT=MAX;}
    }
    const cv=document.createElement('canvas');
    cv.width=w;cv.height=hT;
    cv.getContext('2d').drawImage(img,0,0,w,hT);
    resolve(cv.toDataURL('image/jpeg',0.78));
   };
   img.src=e.target.result;
  };
  reader.readAsDataURL(file);
 });
}
function renderFotos(cityId,cityName){
 // Async loader: render placeholder then load actual photos
 setTimeout(async()=>{
  const photos=await getPhotos(cityId);
  const grid=document.getElementById('photo-grid-'+cityId);
  const counter=document.getElementById('photo-counter-'+cityId);
  if(!grid)return;
  if(counter){
   const isOver=photos.length>10;
   counter.innerHTML=`${photos.length}/10 ${photos.length===1?'photo':'photos'}${isOver?' <span style="color:#ffa552">⚠ exceeds recommended</span>':''}`;
   counter.style.color=isOver?'#ffa552':'';
  }
  if(photos.length===0){
   grid.innerHTML='<div style="padding:18px 14px;font-size:13px;color:var(--dim);text-align:center;grid-column:1/-1">No has subido fotos todavía. Toca el botón verde para agregar.</div>';
  } else {
   grid.innerHTML=photos.sort((a,b)=>b.ts-a.ts).map(p=>`<div class="photo-tile" onclick="viewPhoto(${p.id})"><img src="${p.data}" loading="lazy" alt=""><button class="photo-del" onclick="event.stopPropagation();delPhotoUI(${p.id})">🗑</button></div>`).join('');
  }
 },10);
 return `<div class="card photos-card">
  <div class="card-header">
   <div class="card-title">📸 My Photos - ${cityName}</div>
   <div class="card-sub">On this phone only · <span id="photo-counter-${cityId}">loading...</span> · Recommended: max. 10 per city</div>
  </div>
  <div id="photo-status-${cityId}" class="photo-status"></div>
  <div class="photo-grid" id="photo-grid-${cityId}">
   <div style="padding:14px;font-size:13px;color:var(--dim);text-align:center;grid-column:1/-1">Loading photos...</div>
  </div>
  <div class="photo-add">
   <input type="file" id="photo-input-${cityId}" accept="image/*" multiple style="display:none" onchange="uploadPhotos('${cityId}',this.files)">
   <button class="photo-add-btn" onclick="document.getElementById('photo-input-${cityId}').click()">📷 Upload photos</button>
   <div style="font-size:11px;color:var(--dim);text-align:center;margin-top:6px">Your originals stay in your camera roll - this is a compressed copy</div>
  </div>
 </div>`;
}
async function uploadPhotos(cityId,files){
 if(!files||!files.length)return;
 const status=document.getElementById('photo-status-'+cityId);
 const list=Array.from(files);
 let done=0;
 if(status){status.innerHTML=`⏳ Procesando 0 de ${list.length}...`;status.style.display='block';}
 for(const f of list){
  try{
   if(!f.type.startsWith('image/'))continue;
   const compressed=await compressImage(f);
   await savePhoto(cityId,compressed,'');
   done++;
   if(status)status.innerHTML=`⏳ Processing ${done} of ${list.length}...`;
  }catch(err){
   console.log('photo upload err:',err);
  }
 }
 if(status){status.innerHTML=`✅ ${done} ${done===1?'photo added':'photos added'}`;setTimeout(()=>{status.style.display='none';},2200);}
 renderCityBody();
}
async function delPhotoUI(id){
 if(!confirm('Delete this photo?'))return;
 await delPhoto(id);
 renderCityBody();
}
async function viewPhoto(id){
 const db=await openPhotoDB();
 const tx=db.transaction('photos','readonly');
 const req=tx.objectStore('photos').get(id);
 req.onsuccess=()=>{
  const p=req.result;
  if(!p)return;
  const overlay=document.createElement('div');
  overlay.className='photo-overlay';
  overlay.innerHTML=`<div class="photo-overlay-inner"><img src="${p.data}" alt=""><div class="photo-overlay-info">📅 ${p.date}</div><button class="photo-overlay-close" onclick="this.parentElement.parentElement.remove()">✕ Cerrar</button></div>`;
  overlay.addEventListener('click',e=>{if(e.target===overlay)overlay.remove();});
  document.body.appendChild(overlay);
 };
}

function selC(i){curCity=i;renderCities();}
function selS(s){curSub=s;renderCities();}

// ========= DOCUMENTS SYSTEM (IndexedDB) =========
let docsDB=null;
function openDocsDB(){
 return new Promise((resolve,reject)=>{
  if(docsDB){resolve(docsDB);return;}
  const req=indexedDB.open('europa_docs',1);
  req.onerror=()=>reject(req.error);
  req.onupgradeneeded=e=>{
   const db=e.target.result;
   if(!db.objectStoreNames.contains('docs')){
    const store=db.createObjectStore('docs',{keyPath:'id',autoIncrement:true});
    store.createIndex('cityId','cityId',{unique:false});
   }
  };
  req.onsuccess=()=>{docsDB=req.result;resolve(docsDB);};
 });
}
async function getDocs(cityId){
 try{
  const db=await openDocsDB();
  return new Promise(resolve=>{
   const tx=db.transaction('docs','readonly');
   const req=tx.objectStore('docs').index('cityId').getAll(cityId);
   req.onsuccess=()=>resolve(req.result||[]);
   req.onerror=()=>resolve([]);
  });
 }catch(e){return [];}
}
async function saveDoc(cityId,name,data,size,type){
 const db=await openDocsDB();
 return new Promise((resolve,reject)=>{
  const tx=db.transaction('docs','readwrite');
  const now=new Date();
  const dateStr=now.toLocaleDateString('es-MX',{day:'numeric',month:'short',year:'numeric'});
  const doc={cityId,name,data,size,type,date:dateStr,ts:Date.now()};
  const req=tx.objectStore('docs').add(doc);
  req.onsuccess=()=>resolve(req.result);
  req.onerror=()=>reject(req.error);
 });
}
async function delDoc(id){
 const db=await openDocsDB();
 return new Promise(resolve=>{
  const tx=db.transaction('docs','readwrite');
  tx.objectStore('docs').delete(id);
  tx.oncomplete=()=>resolve(true);
 });
}
function fmtSize(bytes){
 if(bytes<1024)return bytes+'B';
 if(bytes<1048576)return(bytes/1024).toFixed(1)+'KB';
 return(bytes/1048576).toFixed(1)+'MB';
}
function renderDocumentos(cityId,cityName){
 setTimeout(async()=>{
  const docs=await getDocs(cityId);
  const grid=document.getElementById('doc-list-'+cityId);
  const counter=document.getElementById('doc-counter-'+cityId);
  if(!grid)return;
  if(counter)counter.textContent=docs.length+' '+(docs.length===1?'document':'documents');
  if(docs.length===0){
   grid.innerHTML='<div style="padding:18px 14px;font-size:13px;color:var(--dim);text-align:center">No documents yet.<br>Tap the gold button to add a PDF.</div>';
  } else {
   grid.innerHTML=docs.sort((a,b)=>b.ts-a.ts).map(d=>`
    <div class="doc-row" onclick="viewDoc(${d.id})">
     <div class="doc-icon">📄</div>
     <div style="flex:1;min-width:0">
      <div class="doc-name">${escapeHtml(d.name)}</div>
      <div class="doc-size">${fmtSize(d.size)} · ${d.date}</div>
     </div>
     <button class="doc-del" onclick="event.stopPropagation();delDocUI(${d.id})">🗑</button>
    </div>`).join('');
  }
 },10);
 return `<div class="card" style="border-left:3px solid var(--gold)">
  <div class="card-header">
   <div class="card-title">📄 Documents - ${cityName}</div>
   <div class="card-sub">Solo en este teléfono · <span id="doc-counter-${cityId}">loading...</span></div>
  </div>
  <div id="doc-status-${cityId}" class="photo-status"></div>
  <div id="doc-list-${cityId}">
   <div style="padding:14px;font-size:13px;color:var(--dim);text-align:center">Loading documents...</div>
  </div>
  <div class="doc-add">
   <input type="file" id="doc-input-${cityId}" accept=".pdf,application/pdf" multiple style="display:none" onchange="uploadDocs('${cityId}',this.files)">
   <button class="doc-add-btn" onclick="document.getElementById('doc-input-${cityId}').click()">📎 Upload PDF</button>
   <div style="font-size:11px;color:var(--dim);text-align:center;margin-top:6px">Tap to open · save tickets, vouchers, reservations</div>
  </div>
 </div>`;
}
async function uploadDocs(cityId,files){
 if(!files||!files.length)return;
 const status=document.getElementById('doc-status-'+cityId);
 const list=Array.from(files);
 let done=0;
 if(status){status.innerHTML=`⏳ Saving ${done} of ${list.length}...`;status.style.display='block';}
 for(const f of list){
  try{
   if(f.type!=='application/pdf'&&!f.name.toLowerCase().endsWith('.pdf'))continue;
   const reader=new FileReader();
   const data=await new Promise((res,rej)=>{
    reader.onload=e=>res(e.target.result);
    reader.onerror=rej;
    reader.readAsDataURL(f);
   });
   await saveDoc(cityId,f.name,data,f.size,f.type||'application/pdf');
   done++;
   if(status)status.innerHTML=`⏳ Saving ${done} of ${list.length}...`;
  }catch(err){console.log('doc upload err:',err);}
 }
 if(status){status.innerHTML=`✅ ${done} ${done===1?'document saved':'documents saved'}`;setTimeout(()=>{status.style.display='none';},2200);}
 if(cityId==='home'){
  // Refresh home list
  const docs=await getDocs('home');
  const counter=document.getElementById('doc-counter-home');
  const list=document.getElementById('doc-list-home');
  if(counter)counter.textContent=docs.length+' '+(docs.length===1?'document':'documents');
  if(list)list.innerHTML=docs.sort((a,b)=>b.ts-a.ts).map(d=>`
   <div class="doc-row" onclick="viewDoc(${d.id})">
    <div class="doc-icon">📄</div>
    <div style="flex:1;min-width:0">
     <div class="doc-name">${escapeHtml(d.name)}</div>
     <div class="doc-size">${fmtSize(d.size)} · ${d.date}</div>
    </div>
    <button class="doc-del" onclick="event.stopPropagation();delDocHomeUI(${d.id})">🗑</button>
   </div>`).join('');
 } else {
  renderCityBody();
 }
}
async function delDocUI(id){
 if(!confirm('Delete this document?'))return;
 await delDoc(id);
 renderCityBody();
}
async function viewDoc(id){
 const db=await openDocsDB();
 const tx=db.transaction('docs','readonly');
 const req=tx.objectStore('docs').get(id);
 req.onsuccess=()=>{
  const d=req.result;
  if(!d)return;
  const overlay=document.createElement('div');
  overlay.className='doc-overlay';
  overlay.innerHTML=`
   <div class="doc-overlay-bar">
    <div class="doc-overlay-title">📄 ${escapeHtml(d.name)}</div>
    <button class="doc-overlay-close" onclick="this.closest('.doc-overlay').remove()">✕ Cerrar</button>
   </div>
   <iframe class="doc-overlay-frame" src="${d.data}"></iframe>`;
  document.body.appendChild(overlay);
 };
}

function renderTours(){
 document.getElementById('pkg-pills').innerHTML=tourPkgs.map((p,i)=>
  `<button class="pill${i===curPkg?' active':''}" onclick="selP(${i})">${i===0?'🟡':'🔵'} ${p.label}</button>`
 ).join('');
 const pkg=tourPkgs[curPkg];
 document.getElementById('tour-pills').innerHTML=pkg.tours.map((t,i)=>
  `<button class="pill${i===curTour?' active':''}" onclick="selT(${i})">${t.flag} ${t.name.split(' ')[0]}</button>`
 ).join('');
 renderTourBody();
}
function renderTourBody(){
 const t=tourPkgs[curPkg].tours[curTour];
 let h=`<div class="card"><div class="card-header"><div class="card-title">${t.flag} ${t.name}</div><div class="card-sub">${t.base}</div><span class="tag">${tourPkgs[curPkg].label}</span></div>`;
 if(t.desc)h+=`<div style="padding:12px 14px;font-size:14px;color:var(--cream);line-height:1.6;border-bottom:1px solid rgba(201,168,76,0.1)">${t.desc}</div>`;
 h+=`<div class="section-label">Main Attractions & Highlights</div>`;
 h+=t.atractivos.map(a=>`<div class="list-item"><span class="lb">◆</span><div class="list-text">${a[0]}<div class="list-sub">${a[1]}</div></div></div>`).join('');
 h+='</div>';
 h+=`<div class="sec-hdr">Local Cuisine</div><div class="card">`;
 h+=t.gastronomia.map(g=>`<div class="list-item"><span class="lb">◆</span><span class="list-text">${g}</span></div>`).join('');
 h+='</div>';
 document.getElementById('tour-body').innerHTML=h;
}
function selP(i){curPkg=i;curTour=0;renderTours();}
function selT(i){curTour=i;renderTours();}

function renderDist(){
 const total=distMain.reduce((s,r)=>s+r.mi,0);
 let h=`<div class="dist-row" style="background:rgba(201,168,76,0.07)"><span class="dcity" style="color:var(--gold)">Total circuit distance</span><span></span><span class="dkm" style="color:var(--gold)">${total.toLocaleString()} mi</span><span class="dtime"></span></div>`;
 h+=distMain.map(r=>`<div class="dist-row"><span class="dcity">${r.de}</span><span style="color:var(--dim);font-size:11px">→</span><span class="dcity" style="color:var(--cream)">${r.a}</span><span class="dkm">${r.mi} mi</span><span class="dtime">&nbsp;${r.t}</span></div>`).join('');
 document.getElementById('dist-main-card').innerHTML=h;
 document.getElementById('dist-tour-card').innerHTML=distTours.map(r=>
  `<div class="dist-row"><span class="dcity">${r.de}</span><span style="color:var(--dim);font-size:11px">→</span><span class="dcity" style="color:var(--cream)">${r.a}</span><span class="dkm">${r.mi} mi</span><span class="dtime">&nbsp;${r.t}</span></div>`
 ).join('');
}

function renderMonedas(){
 document.getElementById('monedas-card').innerHTML=`
  <div class="curr-row"><div class="csym">€</div><div><div class="cname">Euro</div><div class="crate">1 € = $${EUR.toFixed(2)} USD</div><div class="cnote">🇳🇱🇩🇪🇫🇷🇧🇪🇱🇺 Netherlands, Germany, France, Belgium, Luxembourg</div></div></div>
  <div class="curr-row"><div class="csym">zł</div><div><div class="cname">Polish Zloty (PLN)</div><div class="crate">1 zł = $${PLN.toFixed(2)} USD · 100 zł ≈ $${(PLN*100).toFixed(0)} USD</div><div class="cnote">🇵🇱 Poland (Warsaw & Kraków) · Es UE pero NO usa euro</div></div></div>
  <div class="curr-row"><div class="csym">Kč</div><div><div class="cname">Czech Koruna (CZK)</div><div class="crate">1 Kč = $${CZK.toFixed(2)} USD · 100 Kč ≈ $${(CZK*100).toFixed(0)} USD</div><div class="cnote">🇨🇿 Czech Republic (Prague) · No adoptó el euro</div></div></div>
  <div class="curr-row" style="background:rgba(201,168,76,0.04)"><div class="csym" style="font-size:13px">📅</div><div><div style="font-size:12px;color:var(--muted)">Tipo de cambio al 18 mayo 2026. Verificar antes del viaje en septiembre 2026.</div></div></div>`;
 calcUpdate();
}
// Tasas vs MXN (cuántos MXN vale 1 unidad)
const USD_MXN=17.28;
const ratesToUSD={USD:1,EUR:EUR,PLN:PLN,CZK:CZK};
const currencyMeta={
 MXN:{flag:"🇲🇽",name:"Peso mexicano",sym:"$"},
 EUR:{flag:"💶",name:"Euro",sym:"€"},
 PLN:{flag:"🇵🇱",name:"Złoty polaco",sym:"zł"},
 CZK:{flag:"🇨🇿",name:"Corona checa",sym:"Kč"},
 USD:{flag:"💵",name:"Dólar (tarifa tour)",sym:"$"}
};
function fmtNum(n,cur){
 if(!isFinite(n))return'—';
 const abs=Math.abs(n);
 let dec=2;
 if(cur==='CZK'||cur==='PLN')dec=abs>=100?0:2;
 if(cur==='MXN')dec=abs>=100?0:2;
 return n.toLocaleString('en-US',{minimumFractionDigits:dec,maximumFractionDigits:dec});
}
function calcUpdate(){
 const inp=document.getElementById('calc-input');
 const sel=document.getElementById('calc-from');
 const out=document.getElementById('calc-results');
 if(!inp||!sel||!out)return;
 const v=parseFloat(inp.value);
 const from=sel.value;
 if(!v||v<=0){
  out.innerHTML=`<div style="text-align:center;color:var(--dim);font-size:13px;padding:14px">Ingresa una cantidad para convertir</div>`;
  return;
 }
 const inUSD=v*ratesToUSD[from];
 const targets=['MXN','EUR','PLN','CZK','USD'].filter(c=>c!==from);
 out.innerHTML=targets.map(c=>{
  const result=inUSD/ratesToUSD[c];
  const m=currencyMeta[c];
  const isMXN=c==='MXN';
  return `<div class="calc-result-row${isMXN?' highlight':''}"><div class="cr-label"><span class="cr-flag">${m.flag}</span>${m.name}</div><div class="cr-value">${m.sym} ${fmtNum(result,c)}</div></div>`;
 }).join('');
}
function qSet(n){
 const inp=document.getElementById('calc-input');
 if(inp){inp.value=n;calcUpdate();}
}
document.addEventListener('input',e=>{
 if(e.target&&(e.target.id==='calc-input'||e.target.id==='calc-from'))calcUpdate();
});
document.addEventListener('change',e=>{
 if(e.target&&e.target.id==='calc-from')calcUpdate();
});

// HOME itinerary
const itin=[
 {d:"1",wd:"Dom",dt:"6 Sep",c:"✈️ Mexico City → Amsterdam",n:"Transatlantic flight · overnight on board",tipo:"normal",
  full:`Check in 3 hours early at Mexico City International Airport for the transatlantic flight to Amsterdam. Overnight on board.`},
 {d:"2",wd:"Lun",dt:"7 Sep",c:"🇳🇱 Amsterdam",n:"Arrival · reception · panoramic city tour",tipo:"normal",
  full:`Arrival in Amsterdam, capital of the Kingdom of the Netherlands. Its historic center is included in the UNESCO World Heritage List. After the city panoramic tour, reception and hotel transfer. Accommodation.`},
 {d:"3",wd:"Mar",dt:"8 Sep",c:"🇳🇱→🇩🇪 Amsterdam · Hanover · Berlin",n:"Breakfast · stop in Hanover · arrival Berlin",tipo:"normal",
  full:`Breakfast. We head to Hanover, located on the banks of the Leine River — its name meaning "The High Bank." Founded in medieval times by boatmen, fishermen and merchants. During our tour we visit the Opera Palace, the Aegidienkirche ruins, the Market Church, and the New and Old Town Halls. Then we continue to Berlin, capital of Germany. Accommodation.`},
 {d:"4",wd:"Mié",dt:"9 Sep",c:"🇩🇪 Berlin",n:"Recorrido panorámico · opt. Potsdam (Paq.1)",tipo:"normal",
  full:`Breakfast. We take a panoramic tour of Berlin. Located on the Spree and Havel rivers, Berlin offers unforgettable views. We visit Gendarmenmarkt Square, the Brandenburg Gate, Potsdamer Platz, Frauenkirche, the Zwinger Palace, the Brühl Terrace, the King's Way, and the Martin Luther Statue. Accommodation.`,
  opcionales:["City of Potsdam"]},
 {d:"5",wd:"Jue",dt:"10 Sep",c:"🇩🇪→🇵🇱 Berlin · Warsaw",n:"Breakfast · journey · UNESCO Old Town tour",tipo:"normal",
  full:`Breakfast. We head to Warsaw, capital of Poland. Its Old Town — rebuilt after WWII — is a UNESCO World Heritage Site. During our tour we visit the Royal Castle, the famous Sigismund Column, and the Church of the Visitationists. Accommodation.`},
 {d:"6",wd:"Vie",dt:"11 Sep",c:"🇵🇱 Warsaw → Kraków",n:"Breakfast · journey · Kraków panoramic tour",tipo:"normal",
  full:`Breakfast. We head to Kraków, Poland — another beautiful European city with its UNESCO World Heritage historic center. During our panoramic tour we visit Wawel Castle, the Basilica of Saints Stanislaus and Wenceslaus, St. Mary's Basilica, the Renaissance Cloth Hall, the Main Market Square, and the small Church of St. Adalbert. Accommodation.`},
 {d:"7",wd:"Sáb",dt:"12 Sep",c:"🇵🇱 Cracovia ★ FREE DAY",n:"Opt. Auschwitz (Pkg.1) · Wieliczka (Pkg.2) · or personal tour",tipo:"libre",
  full:`Breakfast. Free day for personal activities or optional excursion. Accommodation.`,
  opcionales:["Auschwitz-Birkenau Concentration Camp","Wieliczka Salt Mines"]},
 {d:"8",wd:"Dom",dt:"13 Sep",c:"🇵🇱→🇨🇿 Kraków · Prague",n:"Breakfast · journey · Prague panoramic tour",tipo:"normal",
  full:`Breakfast. We head to Prague, capital of the Czech Republic and historic capital of Bohemia. Built in the 9th century on the banks of the Vltava River, it became so splendid that all of Europe called it Golden Prague. On our panoramic tour we pass through Wenceslas Square, reach the Old Town Square (between Wenceslas Square and Charles Bridge). In the Old Town Square we see the Astronomical Clock, the Týn Church, the Old Town Hall, St. Nicholas Church and the Jan Hus Monument. After lunch we cross to the other bank and visit Charles Bridge, built in the 14th century. Accommodation.`},
 {d:"9",wd:"Lun",dt:"14 Sep",c:"🇨🇿 Praga ★ FREE DAY",n:"Opt. Vltava Cruise (P1) · Karlovy Vary/Czech Night (P2) · or personal",tipo:"libre",
  full:`Breakfast. Free day for personal activities or optional excursion. Accommodation.`,
  opcionales:["Vltava River Cruise","Excursion to Karlovy Vary","Czech Night with Traditional Dinner"]},
 {d:"10",wd:"Mar",dt:"15 Sep",c:"🇨🇿→🇩🇪 Prague · Nuremberg",n:"Breakfast · journey · Nuremberg city tour",tipo:"normal",
  full:`Breakfast. We head to Nuremberg, Germany. The magnificent Imperial Castle was built on a hilltop about a thousand years ago, becoming the living core of the city. During our tour we visit the Church of Our Lady, the Opera House, the Old Town Hall, and enjoy the fascinating views of the Pegnitz River. Accommodation.`},
 {d:"11",wd:"Mié",dt:"16 Sep",c:"🇩🇪 Nuremberg ★ FREE DAY",n:"Opt. Rothenburg (P1) · Munich (P2) · or personal tour",tipo:"libre",
  full:`Breakfast. Free day for personal activities or optional excursion. Accommodation.`,
  opcionales:["City of Rothenburg ob der Tauber","City of Munich"]},
 {d:"12",wd:"Jue",dt:"17 Sep",c:"🇩🇪 Nuremberg → Frankfurt",n:"Breakfast · journey · Frankfurt city visit",tipo:"normal",
  full:`Breakfast. We head to Frankfurt, located in central Germany on the banks of the Main River — an important global financial center. We visit the Römer merchant buildings (13th-14th centuries), St. Nicholas Church, the Imperial Cathedral of St. Bartholomew, and enjoy the majestic silhouettes of the European Central Bank, the Bank of Germany, and the Frankfurt Stock Exchange. Accommodation.`,
  opcionales:["Evening Boat Cruise on the Main River"]},
 {d:"13",wd:"Vie",dt:"18 Sep",c:"🇩🇪→🇱🇺🇫🇷 Frankfurt · Luxembourg · Metz",n:"Breakfast · Luxembourg stop (opt.) · Metz base city",tipo:"normal",
  full:`Breakfast. We head to the French city of Metz or Thionville. Free time for optional excursions to Luxembourg City in the Grand Duchy of Luxembourg and to the city of Schengen. Accommodation.`,
  opcionales:["City of Luxembourg","City of Schengen"]},
 {d:"14",wd:"Sáb",dt:"19 Sep",c:"🇫🇷 Metz / Thionville ★ FREE DAY",n:"Opt. Luxemburgo/Estr./Colmar (P1) · Schengen (P2) · o Metz libre",tipo:"libre",
  full:`Breakfast. Free day for personal activities or optional excursion. Accommodation.`,
  opcionales:["City of Strasbourg","City of Colmar"]},
 {d:"15",wd:"Dom",dt:"20 Sep",c:"🇫🇷→🇧🇪 Metz · Brussels",n:"Breakfast · journey · Brussels city tour",tipo:"normal",
  full:`Breakfast. We head to Brussels, capital of the Kingdom of Belgium and seat of the European Commission, famous for its beer and chocolate. We visit the impressive Grand Place, the Saint-Hubert Royal Galleries, the Manneken Pis sculpture, the Royal Palace, and the Royal Museums of Fine Arts. Accommodation.`},
 {d:"16",wd:"Lun",dt:"21 Sep",c:"🇧🇪 Bruselas ★ FREE DAY",n:"Opt. Brujas y Gante (Paq.1) · o Bruselas por libre",tipo:"libre",
  full:`Breakfast. Free day for personal activities or optional excursion. Accommodation.`,
  opcionales:["Cities of Bruges and Ghent"]},
 {d:"17",wd:"Mar",dt:"22 Sep",c:"🇧🇪→🇳🇱 Brussels · Amsterdam ⭐ PERSONAL TOUR",n:"No P2: free Amsterdam day → Rijksmuseum, Jordaan, canals",tipo:"tp",
  full:`Breakfast. We head to Amsterdam. Free time for personal activities or optional excursion. Accommodation.`,
  opcionales:["Volendam and Marken","City of The Hague","Village of Giethoorn"]},
 {d:"18",wd:"Mié",dt:"23 Sep",c:"🇳🇱 Amsterdam → ✈️ Mexico City",n:"Breakfast · airport transfer · return flight",tipo:"normal",
  full:`Breakfast. At the indicated time, transfer to the airport for the return flight to Mexico City.`},
];
document.getElementById('quick-itinerary').innerHTML=itin.map((i,idx)=>{
 const opc=i.opcionales&&i.opcionales.length?`<div class="iexp-opc-title">Excursiones opcionales</div>`+i.opcionales.map(o=>`<div class="iexp-opc-item">◆ ${o}</div>`).join(''):'';
 return `<div class="irow" data-day="${idx}" id="irow-${idx}" role="button" tabindex="0">
  <div class="iday"><div class="idaynum">D${i.d}</div><div class="idaydate">${i.wd}<br>${i.dt}</div></div>
  <div style="flex:1;min-width:0">
   <div class="icity${i.tipo==='libre'?' libre':i.tipo==='tp'?' tp':''}">${i.c}<span class="iexp-chev" id="ichev-${idx}">▸</span></div>
   <div class="inote">${i.n}</div>
   <div class="iexp" id="iexp-${idx}" style="display:none">
    <div class="iexp-full">${i.full}</div>
    ${opc}
   </div>
  </div>
 </div>`;
}).join('');

// iOS-friendly: simple click handlers, no touchend interference
(function attachItinClicks(){
 const rows=document.querySelectorAll('#quick-itinerary .irow');
 rows.forEach(function(row){
  row.addEventListener('click',function(){
   const idx=row.getAttribute('data-day');
   const e=document.getElementById('iexp-'+idx);
   const c=document.getElementById('ichev-'+idx);
   if(!e)return;
   const isOpen=e.style.display==='block';
   e.style.display=isOpen?'none':'block';
   if(c)c.textContent=isOpen?'▸':'▾';
  });
 });
})();

document.getElementById('tp-home-box').innerHTML=`<div class="tph">5 personal tour opportunities in the itinerary</div>`+[
 {d:"Day 7 · Sat Sep 12",c:"Kraków",n:"No Auschwitz (P1) or Wieliczka (P2)? Explore Kazimierz Quarter + Main Market Square at your own pace."},
 {d:"Day 9 · Mon Sep 14",c:"Prague",n:"No optional tours? Prague Castle on your own + Charles Bridge at sunrise."},
 {d:"Day 11 · Wed Sep 16",c:"Nuremberg",n:"No Rothenburg or Munich? Nuremberg Trials Courthouse (Room 600) + walkable medieval walls."},
 {d:"Day 14 · Sat Sep 19",c:"Metz",n:"No excursions? Saint-Etienne Cathedral + Centre Pompidou-Metz + Temple Quarter."},
 {d:"Day 17 · Tue Sep 22 ⭐",c:"Amsterdam (recommended)",n:"No P2? Free Amsterdam day for Rijksmuseum, Jordaan neighborhood and unhurried canals."},
].map(t=>`<div class="tpi"><strong>${t.d} · ${t.c}</strong><br>${t.n}</div>`).join('');

// Initialize home documents
(async function initHomeDocs(){
 const docs=await getDocs('home');
 const counter=document.getElementById('doc-counter-home');
 const list=document.getElementById('doc-list-home');
 if(counter)counter.textContent=docs.length+' '+(docs.length===1?'document':'documents');
 if(list){
  if(docs.length===0){
   list.innerHTML='<div style="padding:14px;font-size:13px;color:var(--dim);text-align:center">No has subido documentos todavía.<br>Toca el botón dorado para agregar PDFs del viaje.</div>';
  } else {
   list.innerHTML=docs.sort((a,b)=>b.ts-a.ts).map(d=>`
    <div class="doc-row" onclick="viewDoc(${d.id})">
     <div class="doc-icon">📄</div>
     <div style="flex:1;min-width:0">
      <div class="doc-name">${escapeHtml(d.name)}</div>
      <div class="doc-size">${fmtSize(d.size)} · ${d.date}</div>
     </div>
     <button class="doc-del" onclick="event.stopPropagation();delDocHomeUI(${d.id})">🗑</button>
    </div>`).join('');
  }
 }
})();

async function delDocHomeUI(id){
 if(!confirm('Delete this document?'))return;
 await delDoc(id);
 // Refresh home docs list
 const docs=await getDocs('home');
 const counter=document.getElementById('doc-counter-home');
 const list=document.getElementById('doc-list-home');
 if(counter)counter.textContent=docs.length+' '+(docs.length===1?'document':'documents');
 if(list){
  if(docs.length===0){
   list.innerHTML='<div style="padding:14px;font-size:13px;color:var(--dim);text-align:center">No has subido documentos todavía.</div>';
  } else {
   list.innerHTML=docs.sort((a,b)=>b.ts-a.ts).map(d=>`
    <div class="doc-row" onclick="viewDoc(${d.id})">
     <div class="doc-icon">📄</div>
     <div style="flex:1;min-width:0">
      <div class="doc-name">${escapeHtml(d.name)}</div>
      <div class="doc-size">${fmtSize(d.size)} · ${d.date}</div>
     </div>
     <button class="doc-del" onclick="event.stopPropagation();delDocHomeUI(${d.id})">🗑</button>
    </div>`).join('');
  }
 }
}

// PWA install
let deferred;
window.addEventListener('beforeinstallprompt',e=>{
 e.preventDefault();deferred=e;
 const b=document.getElementById('install-banner');
 b.style.display='block';
 b.addEventListener('click',()=>{deferred.prompt();deferred.userChoice.then(()=>b.style.display='none');});
});
if('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(()=>{});
