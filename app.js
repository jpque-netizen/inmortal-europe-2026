const EUR=20.24,PLN=4.80,CZK=0.84;
const WEATHER_KEY='3245e1b78a27dae5478238f66be1683f';
const WEATHER_CACHE_MIN=30; // cache 30 minutes

// ===== REAL-TIME EXCHANGE RATES =====
async function fetchExchangeRates(){
 try{
  const r=await fetch('https://open.er-api.com/v6/latest/USD');
  const d=await r.json();
  if(d&&d.rates){
   const mxn=d.rates.MXN||17.28;
   const eur=mxn/d.rates.EUR*d.rates.MXN||20.24;
   const pln=mxn/d.rates.PLN||4.80;
   const czk=mxn/d.rates.CZK||0.84;
   // Update globals
   window._EUR=parseFloat((mxn/d.rates.EUR).toFixed(4));
   window._PLN=parseFloat((mxn/d.rates.PLN).toFixed(4));
   window._CZK=parseFloat((mxn/d.rates.CZK).toFixed(4));
   localStorage.setItem('fx_eur',window._EUR);
   localStorage.setItem('fx_pln',window._PLN);
   localStorage.setItem('fx_czk',window._CZK);
   localStorage.setItem('fx_ts',Date.now());
   console.log('FX updated: EUR='+window._EUR+' PLN='+window._PLN+' CZK='+window._CZK);
   return true;
  }
 }catch(e){console.log('FX fetch failed',e);}
 return false;
}
// Load cached or default rates
(function initRates(){
 const ts=parseInt(localStorage.getItem('fx_ts')||'0');
 const age=(Date.now()-ts)/60000; // minutes
 if(age<60&&localStorage.getItem('fx_eur')){
  window._EUR=parseFloat(localStorage.getItem('fx_eur'));
  window._PLN=parseFloat(localStorage.getItem('fx_pln'));
  window._CZK=parseFloat(localStorage.getItem('fx_czk'));
 } else {
  window._EUR=EUR; window._PLN=PLN; window._CZK=CZK;
  // Try to fetch fresh rates
  fetchExchangeRates().then(ok=>{if(ok&&document.getElementById('monedas-card'))renderMonedas();});
 }
})();

// ===== WEATHER SYSTEM =====
async function fetchWeather(cityId,cityName,lat,lon,targetId){
 const cacheKey='wx_'+cityId;
 const cached=localStorage.getItem(cacheKey);
 if(cached){
  try{
   const d=JSON.parse(cached);
   const ageMin=(Date.now()-d.ts)/60000;
   if(ageMin<WEATHER_CACHE_MIN){
    renderWeatherCard(targetId,d,cityName);
    // Refresh in background silently
    if(ageMin>5)fetchWeatherAPI(cityId,cityName,lat,lon,targetId);
    return;
   }
  }catch(e){}
 }
 // Show cached while loading
 if(cached){try{renderWeatherCard(targetId,JSON.parse(cached),cityName);}catch(e){}}
 fetchWeatherAPI(cityId,cityName,lat,lon,targetId);
}

async function fetchWeatherAPI(cityId,cityName,lat,lon,targetId){
 try{
  const url=`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${WEATHER_KEY}`;
  const r=await fetch(url);
  const d=await r.json();
  if(d&&d.main){
   const data={
    ts:Date.now(),
    temp:Math.round(d.main.temp),
    feels:Math.round(d.main.feels_like),
    humidity:d.main.humidity,
    desc:d.weather[0].description,
    icon:d.weather[0].icon,
    wind:Math.round(d.wind.speed*3.6),
    city:d.name,
   };
   localStorage.setItem('wx_'+cityId,JSON.stringify(data));
   renderWeatherCard(targetId,data,cityName);
  }
 }catch(e){
  const el=document.getElementById(targetId);
  if(el){
   const cached=localStorage.getItem('wx_'+cityId);
   if(cached){try{renderWeatherCard(targetId,JSON.parse(cached),cityName,true);}catch(ex){
    el.innerHTML='<div style="padding:14px;color:var(--dim);font-size:13px;text-align:center">Sin señal de internet. Abre la app con conexión para ver el clima.</div>';
   }}else{
    el.innerHTML='<div style="padding:14px;color:var(--dim);font-size:13px;text-align:center">Sin señal de internet. Abre la app con conexión para ver el clima.</div>';
   }
  }
 }
}

function renderWeatherCard(targetId,d,cityName,offline){
 const el=document.getElementById(targetId);
 if(!el)return;
 const icons={'01d':'☀️','01n':'🌙','02d':'⛅','02n':'⛅','03d':'☁️','03n':'☁️',
  '04d':'☁️','04n':'☁️','09d':'🌧️','09n':'🌧️','10d':'🌦️','10n':'🌦️',
  '11d':'⛈️','11n':'⛈️','13d':'❄️','13n':'❄️','50d':'🌫️','50n':'🌫️'};
 const emoji=icons[d.icon]||'🌡️';
 const ago=Math.round((Date.now()-d.ts)/60000);
 const agoText=ago<1?'ahora mismo':ago<60?`hace ${ago} min`:`hace ${Math.round(ago/60)}h`;
 el.innerHTML=`
  <div style="padding:16px 14px">
   <div style="display:flex;align-items:center;gap:14px;margin-bottom:14px">
    <div style="font-size:48px;line-height:1">${emoji}</div>
    <div>
     <div style="font-size:32px;font-weight:700;color:var(--cream)">${d.temp}°C</div>
     <div style="font-size:13px;color:var(--muted);text-transform:capitalize">${d.desc}</div>
    </div>
   </div>
   <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
    <div style="background:var(--bg3);border-radius:8px;padding:10px">
     <div style="font-size:10px;color:var(--dim);margin-bottom:2px">SENSACIÓN</div>
     <div style="font-size:15px;color:var(--cream);font-weight:500">${d.feels}°C</div>
    </div>
    <div style="background:var(--bg3);border-radius:8px;padding:10px">
     <div style="font-size:10px;color:var(--dim);margin-bottom:2px">HUMEDAD</div>
     <div style="font-size:15px;color:var(--cream);font-weight:500">${d.humidity}%</div>
    </div>
    <div style="background:var(--bg3);border-radius:8px;padding:10px">
     <div style="font-size:10px;color:var(--dim);margin-bottom:2px">VIENTO</div>
     <div style="font-size:15px;color:var(--cream);font-weight:500">${d.wind} km/h</div>
    </div>
    <div style="background:var(--bg3);border-radius:8px;padding:10px">
     <div style="font-size:10px;color:var(--dim);margin-bottom:2px">ACTUALIZADO</div>
     <div style="font-size:12px;color:${offline?'#ffa552':'var(--gold)'};font-weight:500">${offline?'📴 '+agoText:'🔄 '+agoText}</div>
    </div>
   </div>
   ${offline?'<div style="margin-top:10px;font-size:11px;color:#ffa552;text-align:center">⚠️ Datos de cuando tenías señal · abre con internet para actualizar</div>':''}
  </div>`;
}

// Fetch weather for tour city
function fetchWeatherForTour(tid,name,lat,lon){
 fetchWeather(tid,name,lat,lon,'tour-wx-body-'+tid);
}

const cities=[
{id:"ams",wlat:52.3676,wlon:4.9041,name:"Ámsterdam",flag:"🇳🇱",country:"Países Bajos",days:"Días 2-3 y 17-18",dates:"Dom 7 Sep – Lun 8 Sep\nVie 22 Sep – Sáb 23 Sep",moneda:"Euro (€)",cambio:`1 € = $${EUR.toFixed(2)} MXN`,
 libre:[],
 tourPersonal:"⭐ Día 17 (Vie 22 Sep): Si no contratas el Paquete 2 (Volendam, La Haya, Giethoorn) tienes Ámsterdam libre. Ideal para el Rijksmuseum, barrio Jordaan y canales a tu ritmo antes del vuelo del día 18.",
 atractivos_itinerario:[
  ["📅 DÍA 2 — Lun 7 Sep","Llegada a Ámsterdam · recepción y traslado al hotel"],
  ["Casco histórico de Ámsterdam","Patrimonio Mundial UNESCO · recorrido panorámico incluido en el tour"],
  ["📅 DÍA 3 — Mar 8 Sep","Desayuno · después nos dirigimos hacia Hannover y Berlín"],
  ["📅 DÍA 17 — Vie 22 Sep ⭐ TOUR PERSONAL","Tiempo libre para actividades personales o excursión opcional"],
  ["Volendam y Marken (Paquete 2)","Pintorescos pueblos pesqueros · casas de madera · trajes tradicionales (Paquete 2)"],
  ["La Haya — Den Haag (Paquete 2)","Sede del gobierno neerlandés · Parlamento · Corte Internacional de Justicia de la ONU"],
  ["Pueblo de Giethoorn (Paquete 2)","La 'Venecia de los Países Bajos' · sin calles, solo canales · solo opera si el vuelo sale después de las 20:00 hrs"],
  ["📅 DÍA 18 — Sáb 23 Sep","Desayuno · traslado al aeropuerto · vuelo de regreso a México"],
 ],
 atractivos_recomendados:[
  ["Rijksmuseum","museo nacional con La Ronda de Noche de Rembrandt · 2.5M visitas/año"],
  ["Casa de Ana Frank","refugio donde la familia Frank se ocultó de los nazis (1942-44)"],
  ["Museo Van Gogh","200+ obras del pintor organizadas por etapas de su vida"],
  ["Barrio Rojo (De Wallen)","zona histórica con la Oude Kerk del siglo XIII"],
  ["Barrio Jordaan","canales pintorescos, mercados y la Iglesia Westerkerk"],
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
  ["De Blauwe Hollander","stamppot y bitterballen auténticos · barrio Jordaan","€10-15"],
  ["FEBO (máquinas)","croquetas, salchichas y snacks en la calle","€2-3"],
  ["HEMA Cafetería","self-service holandés · stamppot €3.50, rookworst €3.59","€3-6"],
  ["Albert Cuyp Market","mercado: stroopwafels, kibbeling, haring · L-S","€3-8"],
  ["Pancakes Amsterdam","panqueques holandeses en todas las variedades","€10-13"],
 ],
 video:{t:"15 lugares imperdibles de Ámsterdam — itinerario 3 días con mapa",d:"Recorrido completo con mapa por los imprescindibles de Ámsterdam · Europa Acompañada",canal:"Europa Acompañada",u:"https://www.youtube.com/watch?v=7iUQUlLUips"},
 mapa:{centro:"Dam Square Amsterdam",url:"https://www.google.com/maps/search/?api=1&query=Dam+Square+Amsterdam+Netherlands",pois:[
  ["Plaza Dam (Dam Square)","Plaza+Dam+Amsterdam"],
  ["Palacio Real de Ámsterdam","Royal+Palace+Amsterdam"],
  ["Casa de Anne Frank","Anne+Frank+House+Amsterdam"],
  ["Rijksmuseum","Rijksmuseum+Amsterdam"],
  ["Museo Van Gogh","Van+Gogh+Museum+Amsterdam"],
  ["Barrio Jordaan","Jordaan+Amsterdam"],
  ["Vondelpark","Vondelpark+Amsterdam"],
  ["Mercado Albert Cuyp","Albert+Cuypmarkt+Amsterdam"],
  ["Estación Central","Amsterdam+Centraal+Station"]
 ]},
 saludos:{idioma:"Neerlandés (Nederlands)",nota:"El neerlandés es la lengua oficial. El inglés lo habla casi todo el mundo, pero un saludo local siempre causa buena impresión.",frases:[
  {cat:"🌅 Buenos días",local:"Goedemorgen",pron:"Jú-de-mor-jen",tip:"Usa hasta aprox. las 12:00"},
  {cat:"☀️ Buenas tardes",local:"Goedemiddag",pron:"Jú-de-mi-daj",tip:"Desde mediodía hasta las 18:00"},
  {cat:"🌙 Buenas noches",local:"Goedenavond",pron:"Jú-den-á-font",tip:"A partir de las 18:00"},
  {cat:"👋 Hola (informal)",local:"Hoi / Hallo",pron:"Jói / Já-lo",tip:"Hoi es muy cotidiano entre jóvenes"},
  {cat:"🙏 Por favor",local:"Alstublieft",pron:"Als-tú-blift",tip:"Abreviado a s.v.p. en carteles"},
  {cat:"😊 Gracias",local:"Dank u wel",pron:"Dank ú vel",tip:"Informal: Dank je (dank ye)"},
  {cat:"🤝 De nada",local:"Graag gedaan",pron:"Jráj je-dán",tip:"Literalmente 'con mucho gusto'"},
  {cat:"❓ ¿Cuánto cuesta?",local:"Hoeveel kost het?",pron:"Jú-feel kost et?",tip:"Muy útil en mercados y tiendas"},
  {cat:"🚽 ¿Dónde está el baño?",local:"Waar is het toilet?",pron:"Vár is et twá-let?",tip:"Toiletten en letreros"},
  {cat:"🍺 ¡Salud!",local:"Proost!",pron:"Próost",tip:"Al brindar · muy usual en bares"}
 ]}
},
{id:"han",wlat:52.3759,wlon:9.732,name:"Hannover",flag:"🇩🇪",country:"Alemania",days:"Día 3 (tránsito)",dates:"Lun 8 Sep (parada en ruta Ámsterdam–Berlín)",moneda:"Euro (€)",cambio:`1 € = $${EUR.toFixed(2)} MXN`,libre:[],tourPersonal:"",
 atractivos_itinerario:[
  ["Palacio de la Ópera (Opernhaus)","uno de los teatros más importantes de Alemania"],
  ["Ruinas de la Iglesia Aegidienkirche","conservadas como memorial a las víctimas de la WWII"],
  ["Iglesia del Mercado (Marktkirche)","gótica del siglo XIV · símbolo de la ciudad"],
  ["Nuevo Ayuntamiento (Neues Rathaus)","con ascensor curvo único en Europa"],
  ["Viejo Ayuntamiento (Altes Rathaus)","edificio medieval en la plaza histórica"],
 ],
 atractivos_recomendados:[
  ["Jardines de Herrenhausen","jardines barrocos de fama internacional · los mejores de Hannover"],
  ["Línea Roja turística","ruta pintada en el suelo que conecta 36 atracciones de la ciudad"],
  ["Ernst August Galerie","galería comercial frente a la estación, arquitectura destacada"],
 ],
 gastronomia:[
  ["Currywurst","salchicha con salsa curry · street food alemán clásico"],
  ["Kartoffelpuffer","tortitas de papa fritas con salsa de manzana"],
  ["Bretzel","pretzel salado · snack típico con cerveza"],
  ["Leine Bier","cerveza artesanal local emblemática de la región"],
 ],
 restaurantes:[
  ["Markthalle Hannover","mercado cubierto con múltiples opciones","€5-10"],
  ["Snack bars zona central","currywurst y pretzels en la calle","€3-5"],
  ["Restaurants en Kröpcke","plaza central · menús de mediodía","€8-13"],
 ],
 video:{t:"Qué ver en Hannover 🇩🇪 — 10 Lugares Imprescindibles",d:"Los 10 lugares imprescindibles de Hannover en español · El Viajero Feliz",canal:"El Viajero Feliz",u:"https://www.youtube.com/watch?v=bXfbGhVGECc"},
 mapa:{centro:"Marktplatz Hannover",url:"https://www.google.com/maps/search/?api=1&query=Marktplatz+Hannover+Germany",pois:[
  ["Palacio de la Ópera (Opernhaus)","Opernhaus+Hannover"],
  ["Ruinas Aegidienkirche","Aegidienkirche+Hannover"],
  ["Marktkirche (Iglesia del Mercado)","Marktkirche+Hannover"],
  ["Nuevo Ayuntamiento (Neues Rathaus)","Neues+Rathaus+Hannover"],
  ["Río Leine","Leine+River+Hannover"]
 ]},
 saludos:{idioma:"Alemán (Deutsch)",nota:"El alemán hannoveriano es considerado el alemán más 'puro' y neutro de Alemania. Un saludo en alemán siempre se agradece.",frases:[
  {cat:"🌅 Buenos días",local:"Guten Morgen",pron:"Gú-ten Mór-jen",tip:"Hasta aprox. las 11:00"},
  {cat:"☀️ Buenas tardes",local:"Guten Tag",pron:"Gú-ten Tak",tip:"Saludo general de día · muy común"},
  {cat:"🌙 Buenas noches",local:"Guten Abend",pron:"Gú-ten Á-bent",tip:"A partir de las 18:00"},
  {cat:"👋 Hola (informal)",local:"Hallo / Moin",pron:"Já-lo / Móin",tip:"Moin es típico del norte de Alemania"},
  {cat:"🙏 Por favor",local:"Bitte",pron:"Bí-te",tip:"También significa 'de nada' al entregar algo"},
  {cat:"😊 Gracias",local:"Danke schön",pron:"Dán-ke shön",tip:"Solo Danke también está bien"},
  {cat:"🤝 De nada",local:"Bitte sehr",pron:"Bí-te séer",tip:"O simplemente Bitte"},
  {cat:"❓ ¿Cuánto cuesta?",local:"Was kostet das?",pron:"Vas kós-tet das?",tip:"Esencial en tiendas y mercados"},
  {cat:"🚽 ¿Dónde está el baño?",local:"Wo ist die Toilette?",pron:"Vo ist di Twá-le-te?",tip:"Busca WC en los letreros"},
  {cat:"🍺 ¡Salud!",local:"Prost!",pron:"Prost",tip:"Clásico alemán al brindar · inevitable"}
 ]}
},
{id:"ber",wlat:52.52,wlon:13.405,name:"Berlín",flag:"🇩🇪",country:"Alemania",days:"Días 3-5",dates:"Lun 8 Sep – Mié 10 Sep",moneda:"Euro (€)",cambio:`1 € = $${EUR.toFixed(2)} MXN`,libre:[],tourPersonal:"",
 atractivos_itinerario:[
  ["📅 DÍA 3 — Lun 8 Sep","Llegada a Berlín desde Hannover · alojamiento"],
  ["📅 DÍA 4 — Mar 9 Sep","Desayuno · visita panorámica de Berlín"],
  ["Plaza Gendarmenmarkt","considerada la plaza más bella de Berlín"],
  ["Puerta de Brandenburgo","símbolo mundial de la reunificación alemana (1989)"],
  ["Potsdamer Platz","moderna plaza con arquitectura vanguardista"],
  ["Frauenkirche","iglesia mencionada en el itinerario del tour"],
  ["Palacio Zwinger","barroco del siglo XVIII · arquitectura deslumbrante"],
  ["Terraza Brühl","promenade real con vistas al río"],
  ["Camino del Rey","paseo histórico mencionado en el itinerario"],
  ["Estatua de Martín Lutero","en la Iglesia Marienkirche"],
  ["Ciudad de Potsdam (Paquete 1)","Capital de Brandeburgo · Palacio Sanssouci UNESCO · residencia de verano de Federico el Grande"],
  ["📅 DÍA 5 — Mié 10 Sep","Desayuno · partida hacia Varsovia"],
 ],
 atractivos_recomendados:[
  ["Muro de Berlín (East Side Gallery)","el mayor mural al aire libre del mundo · 1.3 km"],
  ["Isla de los Museos","Patrimonio UNESCO con 5 museos de primer nivel"],
  ["Memorial del Holocausto","2,711 estelas de hormigón · obra de Peter Eisenman"],
  ["Reichstag","cúpula de vidrio accesible al público · vistas 360° · gratis"],
  ["Checkpoint Charlie","antiguo paso fronterizo · símbolo de la Guerra Fría"],
 ],
 gastronomia:[
  ["Döner Kebab","inventado en Berlín en los años 70 · la ciudad tiene los mejores del mundo"],
  ["Currywurst berlinesa","salchicha con ketchup y curry · plato símbolo de la ciudad"],
  ["Buletten","albóndigas berlinesas con pan y mostaza"],
  ["Berliner Pfannkuchen","rosquilla rellena de mermelada"],
  ["Schnitzel","filete empanizado · herencia austrohúngara"],
 ],
 restaurantes:[
  ["Mustafa's Gemüse Kebap","el döner más famoso del mundo · Mehringdamm 36","€5-6"],
  ["Markthalle Neun","mercado cubierto con street food · jueves y viernes","€5-10"],
  ["Spreewaldgrill","currywurst clásica desde 1930","€3-5"],
  ["Hackescher Markt (zona)","menús variados de mediodía","€9-15"],
 ],
 video:{t:"BERLÍN qué ver y hacer en 3 DÍAS — Alemania",d:"Guía de los lugares más emblemáticos de Berlín · Europa Acompañada",canal:"Europa Acompañada",u:"https://www.youtube.com/watch?v=z2J7xua9q4Y"},
 mapa:{centro:"Brandenburger Tor Berlin",url:"https://www.google.com/maps/search/?api=1&query=Brandenburg+Gate+Berlin",pois:[
  ["Puerta de Brandenburgo","Brandenburg+Gate+Berlin"],
  ["Gendarmenmarkt","Gendarmenmarkt+Berlin"],
  ["Potsdamer Platz","Potsdamer+Platz+Berlin"],
  ["East Side Gallery (Muro)","East+Side+Gallery+Berlin"],
  ["Reichstag","Reichstag+Berlin"],
  ["Memorial del Holocausto","Holocaust+Memorial+Berlin"],
  ["Isla de los Museos","Museum+Island+Berlin"],
  ["Checkpoint Charlie","Checkpoint+Charlie+Berlin"],
  ["Estatua Martín Lutero","Martin+Luther+Statue+Berlin"]
 ]},
 saludos:{idioma:"Alemán (Deutsch) · dialecto berlinés",nota:"Berlín tiene su propio acento y jerga. El berlinés usa Ick (yo) en vez de Ich y tiene fama de ser directo y un poco brusco, pero un saludo siempre abre puertas.",frases:[
  {cat:"🌅 Buenos días",local:"Guten Morgen",pron:"Gú-ten Mór-jen",tip:"Berlín es ciudad de noctámbulos · no esperes caras sonrientes muy temprano"},
  {cat:"☀️ Buenas tardes",local:"Guten Tag",pron:"Gú-ten Tak",tip:"El más neutro y seguro durante el día"},
  {cat:"🌙 Buenas noches",local:"Guten Abend",pron:"Gú-ten Á-bent",tip:"Útil al llegar al hotel o restaurante"},
  {cat:"👋 Hola (berlinés)",local:"Na? / Hallo",pron:"Na / Já-lo",tip:"Na? (¿Qué tal?) es el saludo más berlinés"},
  {cat:"🙏 Por favor",local:"Bitte",pron:"Bí-te",tip:"También sirve para decir 'aquí tiene'"},
  {cat:"😊 Gracias",local:"Danke",pron:"Dán-ke",tip:"Rápido y efectivo · los berlineses lo usan mucho"},
  {cat:"🤝 De nada",local:"Kein Problem",pron:"Káin Pro-blém",tip:"Literalmente 'ningún problema'"},
  {cat:"❓ ¿Cuánto cuesta?",local:"Was kostet das?",pron:"Vas kós-tet das?",tip:"En Berlín hay muchos mercados de pulgas donde lo necesitarás"},
  {cat:"🚽 ¿Dónde está el baño?",local:"Wo ist die Toilette?",pron:"Vo ist di Twá-le-te?",tip:"En el metro se paga 50 céntimos · ten monedas"},
  {cat:"🍺 ¡Salud!",local:"Prost! / Zum Wohl!",pron:"Prost / Tsum Vol",tip:"Berlín tiene la mejor escena de bares de Europa · úsalo bien"}
 ]}
},
{id:"var",wlat:52.2297,wlon:21.0122,name:"Varsovia",flag:"🇵🇱",country:"Polonia",days:"Días 5-6",dates:"Mié 10 Sep – Jue 11 Sep",moneda:"Złoty (zł / PLN)",cambio:`1 zł = $${PLN.toFixed(2)} MXN · 100 zł ≈ $${(PLN*100).toFixed(0)} MXN`,libre:[],tourPersonal:"",
 atractivos_itinerario:[
  ["Ciudad Vieja (Stare Miasto)","Patrimonio UNESCO · reconstruida piedra a piedra tras la WWII"],
  ["Castillo Real (Zamek Królewski)","residencia oficial de los reyes de Polonia"],
  ["Columna de Segismundo","monumento barroco icónico frente al castillo"],
  ["Iglesia de las Visitacionistas (Kościół Wizytek)","barroca · lugar donde Chopin tocó el órgano de niño"],
 ],
 atractivos_recomendados:[
  ["Museo de la Sublevación de Varsovia (1944)","homenaje a la resistencia polaca · uno de los mejores museos de Europa"],
  ["Plaza del Mercado (Rynek Starego Miasta)","rodeada de edificios coloridos del siglo XVI-XVIII"],
  ["Parque Łazienki","palacio sobre el agua y estatua de Chopin · entrada gratuita"],
  ["Barrio Praga","lado alternativo bohemio de Varsovia · galerías y murales"],
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
 video:{t:"Qué ver y hacer en VARSOVIA 2026 — Guía de Varsovia (Polonia)",d:"Guía completa de Varsovia 2026 en español · con narración · muy reciente",canal:"Guías Viajeras",u:"https://www.youtube.com/watch?v=yRWGDgNp8Yo"},
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
 saludos:{idioma:"Polaco (Polski)",nota:"El polaco tiene sonidos difíciles para hispanohablantes. No te preocupes por la perfección — cualquier intento en polaco genera enorme simpatía en los locales.",frases:[
  {cat:"🌅 Buenos días",local:"Dzień dobry",pron:"Yén do-bri",tip:"Funciona todo el día · es el saludo más seguro y formal"},
  {cat:"🌙 Buenas noches",local:"Dobry wieczór",pron:"Dó-bri vyé-choor",tip:"Al llegar a un lugar por la noche"},
  {cat:"👋 Hola (informal)",local:"Cześć",pron:"Cheshch",tip:"Solo para personas de tu edad o jóvenes · muy amistoso"},
  {cat:"🙏 Por favor",local:"Proszę",pron:"Pró-she",tip:"También significa 'aquí tiene' y 'de nada'"},
  {cat:"😊 Gracias",local:"Dziękuję",pron:"Yen-kú-ye",tip:"Versión rápida: Dzięki (Yen-ki)"},
  {cat:"🤝 De nada",local:"Proszę / Nie ma za co",pron:"Pró-she / Nie-ma-za-tso",tip:"Proszę es la respuesta más común"},
  {cat:"❓ ¿Cuánto cuesta?",local:"Ile to kosztuje?",pron:"Í-le to kosh-tú-ye?",tip:"Muy útil en el Mercado del Casco Antiguo"},
  {cat:"🚽 ¿Dónde está el baño?",local:"Gdzie jest toaleta?",pron:"Gdye yest to-a-lé-ta?",tip:"Toaleta en letreros · a veces se paga 1-2 zł"},
  {cat:"🍺 ¡Salud!",local:"Na zdrowie!",pron:"Na zdró-vye",tip:"El brindis polaco · la cerveza (piwo) es excelente y barata"},
  {cat:"😋 ¡Buen provecho!",local:"Smacznego!",pron:"Smach-né-go",tip:"Dilo al sentarte a comer · los polacos lo aprecian mucho"}
 ]}
},
{id:"cra",wlat:50.0647,wlon:19.945,name:"Cracovia",flag:"🇵🇱",country:"Polonia",days:"Días 6-8",dates:"Jue 11 Sep – Sáb 13 Sep",moneda:"Złoty (zł / PLN)",cambio:`1 zł = $${PLN.toFixed(2)} MXN · 100 zł ≈ $${(PLN*100).toFixed(0)} MXN`,
 libre:["🟢 Día 7 — Vie 12 Sep (DÍA LIBRE): Auschwitz-Birkenau (Paquete 1) · Minas Wieliczka (Paquete 2) · o tour personal en Cracovia."],
 tourPersonal:"⭐ Día 7 (Vie 12 Sep): Si no contratas ningún opcional, tienes Cracovia libre para el Barrio Kazimierz (antiguo barrio judío bohemio, lleno de cafés únicos), la Plaza del Mercado a tu ritmo, y el Castillo de Wawel con calma.",
 atractivos_itinerario:[
  ["📅 DÍA 6 — Jue 11 Sep","Desayuno · llegada desde Varsovia · recorrido panorámico"],
  ["Castillo de Wawel","fortaleza real del siglo XI · símbolo máximo de Polonia"],
  ["Catedral de Wawel (Basílica de San Estanislao y San Wenceslao)","panteón real · capillas de distintas épocas y estilos arquitectónicos"],
  ["Corte Renacentista (Sukiennice)","lonja del siglo XIV · ahora museo y tiendas de souvenirs"],
  ["Plaza del Mercado (Rynek Główny)","una de las mayores plazas medievales de Europa"],
  ["Basílica de Santa María (Kościół Mariacki)","gótica con altar tallado de Veit Stoss del siglo XV"],
  ["Iglesia de San Adalberto","pequeña iglesia prerrománica del siglo X"],
  ["📅 DÍA 7 — Vie 12 Sep 🟢 DÍA LIBRE","Excursiones opcionales o tour personal en Cracovia"],
  ["Campo de concentración Auschwitz-Birkenau (Paquete 1)","El complejo nazi más grande · visita profundamente emotiva · monumento a las víctimas del Holocausto"],
  ["Minas de sal de Wieliczka (Paquete 2)","Mina de sal operativa más antigua del mundo · capillas en roca de sal · Capilla de Santa Kinga · UNESCO"],
  ["📅 DÍA 8 — Sáb 13 Sep","Desayuno · partida hacia Praga"],
 ],
 atractivos_recomendados:[
  ["Barrio Kazimierz","antiguo barrio judío · bohemio, lleno de galerías y cafés únicos"],
  ["Ciudad Vieja completa (Patrimonio UNESCO)","caminata por las murallas medievales y la Barbacana"],
  ["Kremówka papieska","el pastel que adoraba Juan Pablo II · probar en la plaza"],
 ],
 gastronomia:[
  ["Obwarzanek krakowski","rosquilla trenzada · ícono gastronómico de Cracovia desde 1400"],
  ["Pierogi de Cracovia","versión local con distintos rellenos · los mejores de Polonia"],
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
 video:{t:"Cracovia 🏘️ qué ver — imprescindibles casco histórico — Polonia",d:"Los imprescindibles del casco histórico de Cracovia en español · Oct 2025",canal:"Turismo Europa",u:"https://www.youtube.com/watch?v=udb0oxK-N0o"},
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
 saludos:{idioma:"Polaco (Polski) · acento de Małopolska",nota:"Cracovia tiene el acento polaco más antiguo y melódico. Los cracovenses son conocidos por ser más cálidos que los varsovianoss. Un intento en polaco siempre genera una gran sonrisa.",frases:[
  {cat:"🌅 Buenos días",local:"Dzień dobry",pron:"Yén do-bri",tip:"El saludo estrella · funciona a toda hora · formal y siempre correcto"},
  {cat:"🌙 Buenas noches",local:"Dobry wieczór",pron:"Dó-bri vyé-choor",tip:"Al entrar a un restaurante o bar por la noche"},
  {cat:"👋 Hola (informal)",local:"Cześć",pron:"Cheshch",tip:"Con jóvenes y en ambiente informal · suena a 'honor' en latín"},
  {cat:"🙏 Por favor",local:"Proszę",pron:"Pró-she",tip:"Irremplazable · úsalo al pedir cualquier cosa"},
  {cat:"😊 Gracias",local:"Dziękuję bardzo",pron:"Yen-kú-ye bár-dzo",tip:"Bardzo = mucho · para expresar gratitud mayor"},
  {cat:"🤝 De nada",local:"Nie ma za co",pron:"Nie-ma-za-tso",tip:"Literalmente 'no hay por qué'"},
  {cat:"❓ ¿Cuánto cuesta?",local:"Ile to kosztuje?",pron:"Í-le to kosh-tú-ye?",tip:"Imprescindible en el Mercado Stary Kleparz"},
  {cat:"🚽 ¿Dónde está el baño?",local:"Gdzie jest toaleta?",pron:"Gdye yest to-a-lé-ta?",tip:"En la Plaza del Mercado hay baños públicos cerca del Cloth Hall"},
  {cat:"🍺 ¡Salud!",local:"Na zdrowie!",pron:"Na zdró-vye",tip:"Cracovia tiene excelentes bares de cerveza artesanal (piwo kraftowe)"},
  {cat:"😋 ¡Buen provecho!",local:"Smacznego!",pron:"Smach-né-go",tip:"Especialmente útil antes de probar los pierogi · plato local icónico"}
 ]}
},
{id:"pra",wlat:50.0755,wlon:14.4378,name:"Praga",flag:"🇨🇿",country:"Rep. Checa",days:"Días 8-10",dates:"Sáb 13 Sep – Lun 15 Sep",moneda:"Corona checa (Kč / CZK)",cambio:`1 Kč = $${CZK.toFixed(2)} MXN · 100 Kč ≈ $${(CZK*100).toFixed(0)} MXN`,
 libre:["🟢 Día 9 — Dom 14 Sep (DÍA LIBRE): Barco Río Moldava (Paquete 1) · Karlovy Vary o Noche Checa con cena (Paquete 2) · o tour personal."],
 tourPersonal:"⭐ Día 9 (Dom 14 Sep): Sin tours opcionales, visita el Castillo de Praga por tu cuenta (no incluido en el tour panorámico del día 8), cruza el Puente de Carlos al amanecer cuando está vacío, y explora Malá Strana con calma.",
 atractivos_itinerario:[
  ["📅 DÍA 8 — Sáb 13 Sep","Desayuno · llegada desde Cracovia · recorrido panorámico por la mañana y tarde"],
  ["Plaza Václav Havel (Wenceslas Square)","una de las plazas más grandes de Praga · bulevar histórico central"],
  ["Plaza de la Ciudad Vieja","entre la Plaza Václav Havel y el Puente Carlos (Karlův Most)"],
  ["Torre del Reloj Astronómico","campanas cada hora · construido en 1410"],
  ["Iglesia de Tyn","gótica del siglo XIV · icónica en la Plaza de la Ciudad Vieja"],
  ["Ayuntamiento Viejo","sede del famoso reloj astronómico"],
  ["Iglesia de San Nicolás","mencionada en el itinerario · barroca del siglo XVIII"],
  ["Monumento a Jan Hus","en la Plaza de la Ciudad Vieja · reformador checo del siglo XV"],
  ["Puente de Carlos (Karlův Most)","construido en el siglo XIV · 30 estatuas barrocas"],
  ["📅 DÍA 9 — Dom 14 Sep 🟢 DÍA LIBRE","Excursiones opcionales o tour personal en Praga"],
  ["Paseo en barco por el Río Moldava (Paquete 1)","Recorrido en barco · pasa bajo el Puente de Carlos · vistas del Castillo de Praga"],
  ["Excursión a Karlovy Vary (Paquete 2)","Elegante balneario · 12 fuentes termales · frecuentado por realeza y celebridades"],
  ["Noche checa con cena tradicional (Paquete 2)","Cena tradicional checa · música folclórica · danzas típicas · vino o cerveza local"],
  ["📅 DÍA 10 — Lun 15 Sep","Desayuno · partida hacia Núremberg"],
 ],
 atractivos_recomendados:[
  ["Castillo de Praga","el mayor del mundo por superficie · domina la ciudad desde la colina"],
  ["Barrio Judío (Josefov)","6 sinagogas históricas y cementerio del siglo XII"],
  ["Barrio Malá Strana","casas barrocas al pie del castillo · muy fotogénico"],
  ["Museo Kafka","homenaje al escritor nacido en Praga en 1883"],
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
 video:{t:"PRAGA qué ver y hacer en 4 DÍAS — Guía República Checa",d:"Guía completa de Praga: Reloj Astronómico, Puente de Carlos, Castillo · Europa Acompañada",canal:"Europa Acompañada",u:"https://www.youtube.com/watch?v=-U1pVFi46mo"},
 mapa:{centro:"Old Town Square Prague",url:"https://www.google.com/maps/search/?api=1&query=Old+Town+Square+Prague",pois:[
  ["Plaza Václav Havel","Wenceslas+Square+Prague"],
  ["Plaza de la Ciudad Vieja","Old+Town+Square+Prague"],
  ["Reloj Astronómico","Prague+Astronomical+Clock"],
  ["Iglesia de Týn","Tyn+Church+Prague"],
  ["Ayuntamiento Viejo","Old+Town+Hall+Prague"],
  ["Iglesia de San Nicolás","St+Nicholas+Church+Prague"],
  ["Monumento a Jan Hus","Jan+Hus+Memorial+Prague"],
  ["Puente de Carlos","Charles+Bridge+Prague"],
  ["Castillo de Praga","Prague+Castle"],
  ["Catedral de San Vito","St+Vitus+Cathedral+Prague"],
  ["Muro de John Lennon","Lennon+Wall+Prague"]
 ]},
 saludos:{idioma:"Checo (Čeština)",nota:"El checo es una lengua eslava con acentos en la primera sílaba. Los checos pueden parecer fríos al principio, pero al oírte intentar su idioma cambian completamente de actitud.",frases:[
  {cat:"🌅 Buenos días",local:"Dobré ráno",pron:"Dob-ré rá-no",tip:"Solo hasta aprox. las 10:00"},
  {cat:"☀️ Buenas tardes",local:"Dobré odpoledne",pron:"Dob-ré od-pó-led-ne",tip:"Desde mediodía · algo formal"},
  {cat:"🌙 Buenas noches",local:"Dobrou noc",pron:"Dob-roh nots",tip:"Al despedirse por la noche"},
  {cat:"👋 Hola (todo el día)",local:"Dobrý den",pron:"Dob-rí den",tip:"El más versátil · saludo formal de día completo"},
  {cat:"👋 Hola (informal)",local:"Ahoj",pron:"A-joy",tip:"Informal y amistoso · igual al español 'ahoy'"},
  {cat:"🙏 Por favor",local:"Prosím",pron:"Pro-sím",tip:"También 'aquí tiene' y respuesta a 'gracias'"},
  {cat:"😊 Gracias",local:"Děkuji",pron:"Dyé-ku-yi",tip:"Informal: Díky (Dí-ki) · muy común"},
  {cat:"🤝 De nada",local:"Prosím / Není zač",pron:"Pro-sím / Né-ní zach",tip:"Prosím es la respuesta más habitual"},
  {cat:"❓ ¿Cuánto cuesta?",local:"Kolik to stojí?",pron:"Ko-lik to sto-yí?",tip:"Esencial · Praga tiene muchos mercados y souvenir"},
  {cat:"🚽 ¿Dónde está el baño?",local:"Kde je toaleta?",pron:"Kde ye to-a-lé-ta?",tip:"WC en letreros · se paga 10-20 Kč en muchos sitios"},
  {cat:"🍺 ¡Salud!",local:"Na zdraví!",pron:"Na zdra-ví",tip:"¡Imprescindible! Praga tiene la mejor cerveza del mundo · mira a todos los ojos al brindar"}
 ]}
},
{id:"nur",wlat:49.4521,wlon:11.0767,name:"Núremberg",flag:"🇩🇪",country:"Alemania",days:"Días 10-12",dates:"Lun 15 Sep – Mié 17 Sep",moneda:"Euro (€)",cambio:`1 € = $${EUR.toFixed(2)} MXN`,
 libre:["🟢 Día 11 — Mar 16 Sep (DÍA LIBRE): Rothenburg ob der Tauber (Paquete 1) · Múnich (Paquete 2) · o tour personal."],
 tourPersonal:"⭐ Día 11 (Mar 16 Sep): Si no contratas opcionales, Núremberg ofrece el Tribunal de Núremberg (Sala 600 donde se juzgaron los crímenes nazis), las murallas medievales caminables de 5 km y el Castillo Imperial, todo a pie desde el hotel.",
 atractivos_itinerario:[
  ["📅 DÍA 10 — Lun 15 Sep","Desayuno · llegada desde Praga · recorrido por la ciudad"],
  ["Castillo Imperial de Núremberg (Kaiserburg)","construido en lo alto de una colina hace unos mil años · núcleo vivo de la ciudad"],
  ["Iglesia de Nuestra Señora (Frauenkirche)","gótica en la Hauptmarkt · reloj con figuras mecánicas"],
  ["Casa de la Ópera (Opernhaus)","edificio de la ópera de Núremberg · mencionado en el itinerario del tour"],
  ["Viejo Ayuntamiento (Altes Rathaus)","con calabozos medievales visitables"],
  ["Río Pegnitz","fascinantes vistas del río que cruza el centro medieval"],
  ["📅 DÍA 11 — Mar 16 Sep 🟢 DÍA LIBRE","Excursiones opcionales o tour personal en Núremberg"],
  ["Ciudad Rothenburg ob der Tauber (Paquete 1)","Ciudad medieval mejor conservada de Alemania · murallas · casas de entramado · Ruta Romántica"],
  ["Ciudad de Múnich (Paquete 2)","Capital de Baviera · Oktoberfest · Marienplatz · Nuevo Ayuntamiento · cultura cervecera"],
  ["📅 DÍA 12 — Mié 17 Sep","Desayuno · partida hacia Frankfurt"],
 ],
 atractivos_recomendados:[
  ["Ciudad Vieja amurallada","murallas medievales casi intactas de 5 km · caminables completas"],
  ["Tribunal de Núremberg (Sala 600)","donde se juzgaron los crímenes nazis en 1945-46 · visitable"],
  ["Hauptmarkt","plaza central · famosa por el Christkindlesmarkt navideño"],
  ["Museo Nacional Germánico","el mayor de arte y cultura germanoparlante del mundo"],
 ],
 gastronomia:[
  ["Nürnberger Bratwürste","las salchichas más famosas de Alemania · diminutas a la parrilla"],
  ["Schäufele","paleta de cerdo asada con chucrut y dumpling de papa"],
  ["Lebkuchen","pan de jengibre especiado · el más famoso de Europa"],
  ["Elisen-Lebkuchen","versión premium del lebkuchen · IGP de Núremberg"],
 ],
 restaurantes:[
  ["Bratwurst Röslein (Hauptmarkt)","bratwürste tradicionales en la plaza central","€8-14"],
  ["Heilig-Geist-Spital","restaurante histórico junto al río","€12-20"],
  ["Puestos Hauptmarkt","salchichas y lebkuchen en la calle","€3-6"],
 ],
 video:{t:"Qué Ver en Núremberg en 3 días — Guía de Viaje 4K",d:"Recorrido completo por Núremberg en 3 días en español · Dic 2024",canal:"Antes Que Viajes",u:"https://www.youtube.com/watch?v=RJEpeRx6jv4"},
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
 saludos:{idioma:"Alemán (Deutsch) · dialecto bávaro-franco",nota:"Núremberg está en Franconia, una región con su propio dialecto. El alemán estándar funciona perfecto, pero algunas expresiones locales te ganarán muchas simpatías.",frases:[
  {cat:"🌅 Buenos días",local:"Guten Morgen",pron:"Gú-ten Mór-jen",tip:"Estándar y siempre correcto"},
  {cat:"☀️ Buenas tardes",local:"Guten Tag",pron:"Gú-ten Tak",tip:"El más neutro durante el día"},
  {cat:"🌙 Buenas noches",local:"Guten Abend",pron:"Gú-ten Á-bent",tip:"Desde las 18:00 · al entrar a restaurantes"},
  {cat:"👋 Hola (franco)",local:"Grüß Gott",pron:"Grüs Got",tip:"Saludo bávaro-franco tradicional · literalmente 'Dios te salude'"},
  {cat:"👋 Hola (informal)",local:"Servus",pron:"Sér-vus",tip:"Típico del sur de Alemania · muy cálido y cercano"},
  {cat:"🙏 Por favor",local:"Bitte",pron:"Bí-te",tip:"Universal en toda Alemania"},
  {cat:"😊 Gracias",local:"Danke schön",pron:"Dán-ke shön",tip:"En dialecto local: Vergelt's Gott (vergelt-s-got)"},
  {cat:"🤝 De nada",local:"Gern geschehen",pron:"Gern je-shé-en",tip:"Con mucho gusto · más cálido que solo Bitte"},
  {cat:"❓ ¿Cuánto cuesta?",local:"Was kostet das?",pron:"Vas kós-tet das?",tip:"Para el mercado del Castillo y la Ciudad Vieja"},
  {cat:"🚽 ¿Dónde está el baño?",local:"Wo ist die Toilette?",pron:"Vo ist di Twá-le-te?",tip:"Busca WC en los letreros medievales"},
  {cat:"🍺 ¡Salud!",local:"Prost!",pron:"Prost",tip:"Con una Nürnberger Bratwurst y cerveza franconiana · experiencia completa"}
 ]}
},
{id:"fra",wlat:50.1109,wlon:8.6821,name:"Frankfurt",flag:"🇩🇪",country:"Alemania",days:"Días 12-13",dates:"Mié 17 Sep – Jue 18 Sep",moneda:"Euro (€)",cambio:`1 € = $${EUR.toFixed(2)} MXN`,libre:[],tourPersonal:"",
 atractivos_itinerario:[
  ["📅 DÍA 12 — Mié 17 Sep","Desayuno · llegada desde Núremberg · visita a Frankfurt"],
  ["Edificios de la familia Römer (ss.XIII-XIV)","el ayuntamiento histórico más fotogénico de Frankfurt"],
  ["Iglesia de San Nicolás","junto al Römerberg · mencionada en el itinerario"],
  ["Catedral Imperial de San Bartolomé","lugar de coronación de los emperadores del Sacro Imperio"],
  ["Banco Central Europeo (BCE)","silueta majestuosa mencionada en el itinerario"],
  ["Banco de Alemania (Deutsche Bundesbank)","una de las instituciones financieras más importantes del mundo"],
  ["Bolsa de Frankfurt (Börse)","famosas estatuas del toro y el oso en su exterior"],
  ["Paseo nocturno en barco por el Río Meno (Paquete 2)","Recorrido nocturno en barco · contraste entre el Römer histórico y el skyline financiero"],
  ["📅 DÍA 13 — Jue 18 Sep","Desayuno · partida hacia Luxemburgo y Metz"],
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
  ["Sachsenhausen (barrio sidrerías)","Äppelwoi y Handkäse · ambiente local auténtico","€3-10"],
  ["Zum Gemalten Haus","sidrería clásica con Grüne Soße casera","€10-18"],
 ],
 video:{t:"GUÍA COMPLETA — Qué ver en Frankfurt del Meno (Alemania)",d:"Guía completa de Frankfurt con todos los puntos de interés · Mar 2025",canal:"Turismo y Viajes",u:"https://www.youtube.com/watch?v=wXLk0_PakKI"},
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
 saludos:{idioma:"Alemán (Deutsch) · dialecto hessiano",nota:"Frankfurt es la ciudad más cosmopolita de Alemania. El inglés es muy hablado, especialmente en el área financiera. El dialecto local se llama Hessisch pero el alemán estándar es perfecto.",frases:[
  {cat:"🌅 Buenos días",local:"Guten Morgen",pron:"Gú-ten Mór-jen",tip:"Frankfurt madruga mucho — ciudad financiera"},
  {cat:"☀️ Buenas tardes",local:"Guten Tag",pron:"Gú-ten Tak",tip:"Seguro y formal durante el día"},
  {cat:"🌙 Buenas noches",local:"Guten Abend",pron:"Gú-ten Á-bent",tip:"Al llegar al Sachsenhausen para cenar"},
  {cat:"👋 Hola (hessiano)",local:"Guude!",pron:"Gú-de",tip:"El saludo típico de Frankfurt · muy local y apreciado"},
  {cat:"👋 Hola (informal)",local:"Hallo / Hey",pron:"Já-lo / Jey",tip:"En bares y zonas jóvenes del Sachsenhausen"},
  {cat:"🙏 Por favor",local:"Bitte",pron:"Bí-te",tip:"Múltiple uso: pedir, agradecer y dar"},
  {cat:"😊 Gracias",local:"Danke",pron:"Dán-ke",tip:"Rápido y efectivo · en el dialecto local: Merci (francés adoptado)"},
  {cat:"🤝 De nada",local:"Bitte sehr",pron:"Bí-te séer",tip:"Con mucho gusto · correcto y amable"},
  {cat:"❓ ¿Cuánto cuesta?",local:"Was kostet das?",pron:"Vas kós-tet das?",tip:"Útil en el mercado del Römer y tiendas del Zeil"},
  {cat:"🚽 ¿Dónde está el baño?",local:"Wo ist die Toilette?",pron:"Vo ist di Twá-le-te?",tip:"Los baños del aeropuerto son los mejores de Europa"},
  {cat:"🍺 ¡Salud!",local:"Prost! / Ebbelwei!",pron:"Prost / É-bel-vai",tip:"Ebbelwei es la sidra de manzana de Frankfurt · brinda con ella en el Sachsenhausen"}
 ]}
},
{id:"lux",wlat:49.6116,wlon:6.1319,name:"Luxemburgo",flag:"🇱🇺",country:"Gran Ducado de Luxemburgo",days:"Día 13 (excursión) y 14",dates:"Jue 18 Sep – Vie 19 Sep",moneda:"Euro (€)",cambio:`1 € = $${EUR.toFixed(2)} MXN`,
 libre:["Día 14 — Vie 19 Sep: Luxemburgo es excursión opcional del Paquete 1 desde Metz (55 km · 45 min en tren)."],
 tourPersonal:"⭐ Día 14 (Vie 19 Sep): Si no contratas el tour a Luxemburgo, puedes ir por tu cuenta desde Metz en tren (€10-15 ida y vuelta). La Ciudad de Luxemburgo es visitable en un día completo caminando.",
 atractivos_itinerario:[
  ["Ciudad de Luxemburgo (excursión opcional Paquete 1)","Patrimonio UNESCO · incluida en el tour opcional"],
  ["Ciudad de Schengen (Paquete 2)","Donde se firmó el Acuerdo de Schengen (1985) que abolió los controles fronterizos en Europa"],
 ],
 atractivos_recomendados:[
  ["Casco Antiguo y barrancos del Pétrusse","ciudad sobre profundos valles · vistas únicas"],
  ["Casamatas del Bock","túneles defensivos del siglo XVII abiertos al público"],
  ["Palacio Gran Ducal","residencia oficial del Gran Duque · en el centro histórico"],
  ["Puente Adolphe","art nouveau sobre el valle · vistas espectaculares"],
  ["Place d'Armes","plaza central animada con terrazas"],
 ],
 gastronomia:[
  ["Judd mat Gaardebounen","cerdo ahumado con habas verdes · plato nacional de Luxemburgo"],
  ["Gromperekichelcher","buñuelos de papa callejeros · los más populares"],
  ["Quetschentaart","tarta de ciruelas · postre tradicional luxemburgués"],
  ["Vino Mosela luxemburgués","blancos secos producidos junto al río Mosela"],
 ],
 restaurantes:[
  ["Place d'Armes (brasseries)","menús del día en la plaza central","€12-20"],
  ["Grund (barrio bajo)","restaurantes junto al río Alzette · más económicos","€10-15"],
  ["Mercado cubierto (Knuedler)","quesos, embutidos y productos locales","€5-10"],
 ],
 video:{t:"Qué ver en Luxemburgo en un día — mi ruta perfecta 🇱🇺",d:"Ruta perfecta por la Ciudad de Luxemburgo en español · Sep 2025",canal:"Viajeros en español",u:"https://www.youtube.com/watch?v=gX76bDVBpDc"},
 mapa:{centro:"Place Guillaume II Luxembourg",url:"https://www.google.com/maps/search/?api=1&query=Place+Guillaume+II+Luxembourg+City",pois:[
  ["Plaza Guillaume II","Place+Guillaume+II+Luxembourg"],
  ["Casamatas del Bock","Bock+Casemates+Luxembourg"],
  ["Palacio Gran Ducal","Grand+Ducal+Palace+Luxembourg"],
  ["Catedral Notre-Dame","Notre+Dame+Cathedral+Luxembourg"],
  ["Puente Adolphe","Adolphe+Bridge+Luxembourg"],
  ["Chemin de la Corniche","Chemin+de+la+Corniche+Luxembourg"],
  ["Casco Antiguo","Luxembourg+Old+Quarter"],
  ["Schengen","Schengen+Luxembourg"]
 ]},
 saludos:{idioma:"Luxemburgués (Lëtzebuergesch) · Francés · Alemán",nota:"Luxemburgo tiene 3 idiomas oficiales: luxemburgués, francés y alemán. Todos los hablan. El francés es el más práctico para turistas. Un saludo en luxemburgués es muy especial.",frases:[
  {cat:"🌅 Buenos días (lux.)",local:"Gudde Moien",pron:"Gú-de Móy-en",tip:"El saludo más especial que puedes dar · úsalo y verás las caras de sorpresa"},
  {cat:"☀️ Buenos días (fr.)",local:"Bonjour",pron:"Bon-yur",tip:"Seguro y universal en toda la ciudad"},
  {cat:"🌙 Buenas noches (fr.)",local:"Bonsoir",pron:"Bon-swár",tip:"A partir de las 18:00"},
  {cat:"👋 Hola (lux.)",local:"Moien",pron:"Móy-en",tip:"Muy coloquial · los luxemburgueses lo usan entre ellos todo el día"},
  {cat:"🙏 Por favor (fr.)",local:"S'il vous plaît",pron:"Sil-vu-plé",tip:"Imprescindible en tiendas y cafés"},
  {cat:"😊 Gracias (lux.)",local:"Merci",pron:"Mer-sí",tip:"Usan el Merci francés · igual en los 3 idiomas"},
  {cat:"🤝 De nada (fr.)",local:"De rien / Je vous en prie",pron:"De ryen / Ye vuz on prí",tip:"De rien en casual · Je vous en prie en formal"},
  {cat:"❓ ¿Cuánto cuesta? (fr.)",local:"Combien ça coûte?",pron:"Com-byén sa kut?",tip:"En el mercado Guillaume o tiendas del casco"},
  {cat:"🚽 ¿Baño? (fr.)",local:"Où sont les toilettes?",pron:"Ú son le twá-let?",tip:"Pregunta en cualquier café con confianza"},
  {cat:"🍺 ¡Salud! (lux.)",local:"Prost! / Santé!",pron:"Prost / San-té",tip:"Prost del alemán y Santé del francés · los dos son correctos"}
 ]}
},
{id:"met",wlat:49.1193,wlon:6.1757,name:"Metz",flag:"🇫🇷",country:"Francia (Lorena)",days:"Días 13-15 (ciudad base)",dates:"Jue 18 Sep – Sáb 20 Sep",moneda:"Euro (€)",cambio:`1 € = $${EUR.toFixed(2)} MXN`,
 libre:["🟢 Día 14 — Vie 19 Sep (DÍA LIBRE): Estrasburgo/Colmar (Paq.1) · Luxemburgo (Paq.1) · Schengen (Paq.2) · o Metz por libre."],
 tourPersonal:"⭐ Día 14 (Vie 19 Sep): Si no contratas excursiones, Metz misma ofrece la Catedral de San Esteban (vitrales medievales más grandes del mundo), el Centre Pompidou-Metz y el Barrio del Temple, todo caminable en un día muy agradable.",
 atractivos_itinerario:[
  ["📅 DÍA 13 — Jue 18 Sep","Desayuno · llegada desde Frankfurt · tiempo libre para excursiones opcionales"],
  ["Ciudad de Luxemburgo (Paquete 1)","Capital del Gran Ducado · Casamatas UNESCO · uno de los centros financieros y políticos de Europa"],
  ["Ciudad de Schengen (Paquete 2)","Donde se firmó el Acuerdo de Schengen (1985) que abolió los controles fronterizos en Europa"],
  ["Metz / Thionville como ciudad base","alojamiento durante los días 13-15"],
  ["📅 DÍA 14 — Vie 19 Sep 🟢 DÍA LIBRE","Excursiones opcionales o exploración libre de Metz"],
  ["Estrasburgo (Paquete 1)","Catedral gótica · sede del Parlamento Europeo · excursión junto con Colmar (Paquete 1)"],
  ["Colmar (Paquete 1)","Arquitectura de cuento de hadas · barrio 'Pequeña Venecia' · excursión junto con Estrasburgo (Paquete 1)"],
  ["📅 DÍA 15 — Sáb 20 Sep","Desayuno · partida hacia Bruselas"],
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
 video:{t:"🇫🇷 Qué hacer en Metz Francia — Lugares Imprescindibles",d:"Los lugares imprescindibles de Metz en español · el mejor video disponible · Feb 2024",canal:"Explora el Mundo",u:"https://www.youtube.com/watch?v=fB4Rnr_kCJM"},
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
 saludos:{idioma:"Francés (Français) · Lorena",nota:"Metz es una ciudad de la región de Lorena, frontera con Alemania y Luxemburgo. El francés es el idioma de uso diario. Los loreneneses aprecian mucho el esfuerzo por hablar su lengua.",frases:[
  {cat:"🌅 Buenos días",local:"Bonjour",pron:"Bon-yur",tip:"El saludo más importante en Francia · siempre primero que cualquier pregunta"},
  {cat:"🌙 Buenas noches",local:"Bonsoir",pron:"Bon-swár",tip:"A partir de las 18:00 · en restaurantes y tiendas"},
  {cat:"👋 Hola (informal)",local:"Salut",pron:"Sa-lú",tip:"Solo con personas de confianza o jóvenes · nunca a desconocidos"},
  {cat:"🙏 Por favor",local:"S'il vous plaît",pron:"Sil-vu-plé",tip:"Obligatorio antes de pedir cualquier cosa · sin esto pueden ignorarte"},
  {cat:"😊 Gracias",local:"Merci beaucoup",pron:"Mer-sí bo-kú",tip:"Beaucoup = mucho · solo Merci también está perfecto"},
  {cat:"🤝 De nada",local:"De rien / Avec plaisir",pron:"De ryen / A-vek ple-zír",tip:"Avec plaisir es más cálido · con mucho gusto"},
  {cat:"❓ ¿Cuánto cuesta?",local:"Combien ça coûte?",pron:"Com-byén sa kut?",tip:"En el mercado Place de la Cathédrale o tiendas locales"},
  {cat:"🚽 ¿Dónde está el baño?",local:"Où sont les toilettes?",pron:"Ú son le twá-let?",tip:"Los franceses no dicen 'salle de bain' para baños públicos"},
  {cat:"🍺 ¡Salud!",local:"Santé!",pron:"San-té",tip:"Obligatorio mirar a los ojos · no hacerlo trae mala suerte según la tradición francesa"},
  {cat:"😋 ¡Buen provecho!",local:"Bon appétit!",pron:"Bon a-pe-tí",tip:"Dilo al sentarte · los franceses lo dicen antes de cada comida"}
 ]}
},
{id:"bru",wlat:50.8503,wlon:4.3517,name:"Bruselas",flag:"🇧🇪",country:"Bélgica",days:"Días 15-17",dates:"Sáb 20 Sep – Lun 22 Sep",moneda:"Euro (€)",cambio:`1 € = $${EUR.toFixed(2)} MXN`,
 libre:["🟢 Día 16 — Dom 21 Sep (DÍA LIBRE): Brujas y Gante (Paquete 1) · o Bruselas por libre."],
 tourPersonal:"Día 16 (Dom 21 Sep): Si no tomas el tour a Brujas/Gante, Bruselas ofrece el Atomium, los Museos Reales de Bellas Artes (Magritte, Bruegel, Rubens) y el Barrio Europeo, todo a pie.",
 atractivos_itinerario:[
  ["📅 DÍA 15 — Sáb 20 Sep","Desayuno · llegada desde Metz · recorrido por Bruselas"],
  ["Grand Place (Plaza Mayor)","Patrimonio UNESCO · considerada la plaza más bella del mundo"],
  ["Galerías Reales de Saint-Hubert","pasaje comercial neoclásico del siglo XIX"],
  ["Manneken Pis","escultura icónica símbolo de Bruselas"],
  ["Palacio Real de Bruselas","residencia oficial del rey belga"],
  ["Museos Reales de Bellas Artes","Bruegel, Rubens y Magritte bajo el mismo techo"],
  ["📅 DÍA 16 — Dom 21 Sep 🟢 DÍA LIBRE","Excursiones opcionales o Bruselas por libre"],
  ["Ciudades de Brujas y Gante (Paquete 1)","Brujas: 'Venecia del Norte' · canales medievales · arquitectura flamenca. Gante: castillo medieval · ciudad vibrante"],
  ["📅 DÍA 17 — Lun 22 Sep","Desayuno · partida hacia Ámsterdam"],
 ],
 atractivos_recomendados:[
  ["Atomium","estructura de hierro en forma de átomo · Expo 1958 · ícono de Bruselas"],
  ["Barrio Europeo","sede de la Comisión Europea y el Parlamento Europeo"],
  ["Catedral de San Miguel y Santa Gúdula","gótica del siglo XIII · impresionante interior"],
  ["Barrio de las Marolles","popular con mercado de antigüedades Place du Jeu de Balle"],
 ],
 gastronomia:[
  ["Gaufres de Bruselas","waffle rectangular y crujiente · el auténtico es el de la calle"],
  ["Moules-frites","mejillones al vapor con papas fritas · plato nacional belga"],
  ["Carbonade flamande","estofado de ternera a la cerveza belga · profundo y sabroso"],
  ["Chocolate belga","Godiva, Neuhaus, Leonidas · los mejores del mundo"],
  ["Cerveza belga","1,500+ variedades: Trappist, Gueuze, Lambic, Dubbel"],
  ["Frites belges","papas fritas en cono con mayonesa · las más crujientes de Europa"],
 ],
 restaurantes:[
  ["Friterie Antoine (Place Jourdan)","las papas fritas más famosas de Bruselas","€4-6"],
  ["Rue du Marché aux Fromages","calle de menús mediterráneos variados","€8-13"],
  ["Mercado de Midi (domingos)","el mayor mercado de Bélgica · quesos, panes","€3-8"],
  ["Moeder Lambic (St-Gilles)","400+ cervezas artesanales con tapas","€5-12"],
 ],
 video:{t:"Descubre BRUSELAS, BRUJAS y GANTE — lo imprescindible de Bélgica",d:"Las tres ciudades más bellas de Bélgica en un solo video · Dic 2024",canal:"Guía Mundial de Viajes",u:"https://www.youtube.com/watch?v=hJmQYpXPt5g"},
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
 saludos:{idioma:"Francés (Français) · Neerlandés (Nederlands)",nota:"Bruselas es oficialmente bilingüe pero en la práctica se usa más el francés. Los belgas son famosos por ser muy amables y tolerantes con los extranjeros que intentan su idioma.",frases:[
  {cat:"🌅 Buenos días (fr.)",local:"Bonjour",pron:"Bon-yur",tip:"El saludo que abre todas las puertas en Bruselas"},
  {cat:"🌙 Buenas noches (fr.)",local:"Bonsoir",pron:"Bon-swár",tip:"Al llegar a restaurantes o bares por la noche"},
  {cat:"👋 Hola (belga)",local:"Dag / Bonjour",pron:"Daj / Bon-yur",tip:"Dag es el saludo neerlandés · muy usado en Bruselas también"},
  {cat:"🙏 Por favor (fr.)",local:"S'il vous plaît",pron:"Sil-vu-plé",tip:"Esencial antes de pedir cualquier cosa · los belgas son muy formales"},
  {cat:"😊 Gracias (fr.)",local:"Merci",pron:"Mer-sí",tip:"En Bruselas también aceptan Dank u (neerlandés)"},
  {cat:"😊 Gracias (neer.)",local:"Dank u wel",pron:"Dank ú vel",tip:"Usar esto en Bruselas sorprende y agrada mucho"},
  {cat:"🤝 De nada",local:"De rien / Graag gedaan",pron:"De ryen / Jráj je-dán",tip:"Francés o neerlandés según el idioma en que hables"},
  {cat:"❓ ¿Cuánto cuesta? (fr.)",local:"Combien ça coûte?",pron:"Com-byén sa kut?",tip:"Para el mercado de la Grand Place y chocolate belga"},
  {cat:"🚽 ¿Dónde está el baño? (fr.)",local:"Où sont les toilettes?",pron:"Ú son le twá-let?",tip:"Muchos bares belgas tienen WC solo para clientes"},
  {cat:"🍺 ¡Salud!",local:"Santé! / Proost!",pron:"San-té / Próost",tip:"Bélgica tiene más de 1,500 cervezas · merece un brindis especial"},
  {cat:"🍫 ¡Esto está delicioso!",local:"C'est délicieux!",pron:"Se de-li-syó",tip:"Dilo al probar el chocolate belga · es la verdad absoluta"}
 ]}
},
];

const tours=[
 {id:"pot",wlat:52.3906,wlon:13.0645,name:"Potsdam",flag:"🇩🇪",
  precio:"$90 USD",base:"Desde Berlín · 35 km · 35 min",
  desc:"Potsdam lleva una pinta real con los palacios de los reyes de Prusia y sus parques. En Potsdam se celebró la Conferencia de Paz después de la Segunda Guerra Mundial. Durante nuestro recorrido veremos el Palacio de la ciudad, la iglesia de San Nicolás, la Puerta de Brandenburgo, el exquisito Palacio de Sanssouci y el fabuloso Palacio de Cecilienhof.",
  atractivos:[
   ["Palacio de Sanssouci","residencia de verano de Federico el Grande · Patrimonio UNESCO"],
   ["Palacio de Cecilienhof","sede de la Conferencia de Potsdam (1945) · donde se firmó el Tratado de Paz"],
   ["Palacio de la Ciudad (Stadtschloss)","palacio reconstruido · sede del Parlamento de Brandeburgo"],
   ["Iglesia de San Nicolás","iglesia neoclásica con gran cúpula · en el centro histórico"],
   ["Puerta de Brandenburgo de Potsdam","no confundir con la de Berlín · barroca del s.XVIII"],
  ],
  recomendados:[
   ["Parque Sanssouci","300 hectáreas de jardines y palacios interconectados · muy fotogénico"],
   ["Barrio holandés (Holländisches Viertel)","casas de estilo holandés del s.XVIII · único en Alemania"],
  ],
  gastronomia:["Misma gastronomía alemana que Berlín · bratwurst, pretzels, schnitzel","Cafés junto al parque Sanssouci con ambiente más refinado que en Berlín","Restaurantes en el barrio holandés con ambiente bohemio"],
  restaurantes:[
   ["Café Lubitsch","frente al palacio · café histórico con terraza"],
   ["Restaurant Juliette","cocina francesa-alemana en el barrio holandés"],
  ],
  saludos:{idioma:"Alemán (Deutsch)",nota:"El alemán hannoveriano es considerado el alemán más puro. Potsdam es 100% alemana — un saludo en alemán siempre se agradece.",frases:[
   {cat:"🌅 Buenos días",local:"Guten Morgen",pron:"Gú-ten Mór-jen",tip:"Hasta aprox. las 11:00"},
   {cat:"☀️ Buen día",local:"Guten Tag",pron:"Gú-ten Tak",tip:"Saludo neutro y seguro durante el día"},
   {cat:"🙏 Por favor",local:"Bitte",pron:"Bí-te",tip:"También significa 'de nada' al entregar algo"},
   {cat:"😊 Gracias",local:"Danke schön",pron:"Dán-ke shön",tip:"Solo Danke también funciona"},
   {cat:"🍺 ¡Salud!",local:"Prost!",pron:"Prost",tip:"El brindis alemán clásico"},
  ]},
  mapa:{centro:"Potsdam Germany",pois:[["Palacio Sanssouci","Sanssouci Palace Potsdam"],["Palacio Cecilienhof","Cecilienhof Palace Potsdam"],["Puerta de Brandenburgo Potsdam","Brandenburg Gate Potsdam"],["Iglesia San Nicolás","St Nicholas Church Potsdam"]]},
  video:{t:"Potsdam Germany - Sanssouci Palace & Park Walking Tour",u:"https://www.youtube.com/watch?v=Wd9GIW0RQTM"}
 },
 {id:"aus",wlat:50.0274,wlon:19.2037,name:"Auschwitz-Birkenau",flag:"🇵🇱",
  precio:"$95 USD",base:"Desde Cracovia · 75 km · 1h 15min",
  desc:"El museo engloba dos campos de concentración: Auschwitz I y Auschwitz-Birkenau, con sus torres de guardia, el bloque de la muerte, crematorio, muro de la muerte, vía de trenes con rampa, cabañas y torres de vigilancia. Una visita profundamente emotiva e histórica, considerada un monumento a las víctimas del Holocausto.",
  atractivos:[
   ["Campo Auschwitz I","campo principal · entrada con letrero 'Arbeit Macht Frei' · bloque de la muerte · crematorio"],
   ["Campo Auschwitz II-Birkenau","el mayor campo de exterminio · ruinas de cámaras de gas · vía de trenes con rampa"],
   ["Muro de la muerte","lugar de ejecuciones entre los bloques 10 y 11"],
   ["Torres de vigilancia","preservadas tal como estaban en 1945"],
   ["Museo Estatal","Patrimonio UNESCO desde 1979 · uno de los sitios históricos más visitados del mundo"],
  ],
  recomendados:[
   ["Visita guiada oficial","muy recomendada · los guías del memorial aportan contexto histórico invaluable"],
   ["Llegada temprana","el memorial abre a las 7:30 · llegar antes de las 9:00 para evitar aglomeraciones"],
  ],
  gastronomia:["Visita memorial · llevar agua y snack · no hay restaurantes en el recinto","Pueblo de Oświęcim a 2 km con restaurantes polacos tradicionales","Cafetería básica disponible en la entrada del memorial"],
  restaurantes:[
   ["Restaurantes en Oświęcim","a 2 km del memorial · cocina polaca tradicional"],
  ],
  saludos:{idioma:"Polaco (Polski)",nota:"Cualquier intento en polaco genera enorme simpatía. La visita al memorial es solemne — los saludos son discretos.",frases:[
   {cat:"🌅 Buenos días",local:"Dzień dobry",pron:"Yén do-bri",tip:"El saludo más seguro y formal"},
   {cat:"🙏 Por favor",local:"Proszę",pron:"Pró-she",tip:"También significa 'aquí tienes' y 'de nada'"},
   {cat:"😊 Gracias",local:"Dziękuję",pron:"Yen-kú-ye",tip:"Versión rápida: Dzięki (Yén-ki)"},
   {cat:"🤝 De nada",local:"Nie ma za co",pron:"Nie-ma-za-tso",tip:"Literalmente 'no hay por qué'"},
  ]},
  mapa:{centro:"Auschwitz-Birkenau Memorial Poland",pois:[["Campo Auschwitz I","Auschwitz I Memorial Museum"],["Campo Birkenau","Auschwitz II Birkenau"],["Entrada principal","Auschwitz Memorial entrance"]]},
  video:{t:"Auschwitz-Birkenau Memorial Museum - Guided Visit",u:"https://www.youtube.com/watch?v=1tHDMFJxaFY"}
 },
 {id:"mol",wlat:50.0755,wlon:14.4378,name:"Barco por el Río Moldava",flag:"🇨🇿",
  precio:"$66 USD",base:"Desde el centro de Praga",
  desc:"Subiremos a bordo de un barco de recreo para un romántico crucero nocturno por el corazón de Praga. Veremos majestuosos lugares de interés como el Puente de Carlos, la Casa Danzante, la Torre Petrin y el histórico fuerte de Vysehrad. Admiraremos la sala de conciertos neorrenacentista del Rudolfinum y el mayor complejo de castillos del mundo, el Castillo de Praga.",
  atractivos:[
   ["Puente de Carlos","visto desde el agua · perspectiva única imposible desde tierra"],
   ["Casa Danzante (Ginger & Fred)","icónico edificio deconstructivista de Frank Gehry"],
   ["Torre Petrin","torre mirador sobre la colina · iluminada de noche"],
   ["Fuerte de Vysehrad","fortaleza histórica sobre el río · legendaria en la historia checa"],
   ["Rudolfinum","sala de conciertos neorrenacentista · sede de la Filarmónica Checa"],
   ["Castillo de Praga","el mayor complejo de castillos del mundo · visto en toda su majestuosidad"],
  ],
  recomendados:[
   ["Crucero nocturno","la versión nocturna con Praga iluminada es la más impresionante"],
   ["Crucero con cena","algunas opciones incluyen cena checa y música en vivo a bordo"],
  ],
  gastronomia:["Algunos cruceros incluyen cena checa y bebidas a bordo","Opciones de crucero-cena con música tradicional bohemia en vivo","Svíčková (lomo en salsa de crema) · el plato checo más representativo"],
  restaurantes:[
   ["Restaurantes frente al Moldava","terraza junto al río · vistas al Puente de Carlos"],
  ],
  saludos:{idioma:"Checo (Čeština)",nota:"Los checos pueden parecer fríos al principio, pero al oírte intentar su idioma cambian completamente de actitud.",frases:[
   {cat:"👋 Hola (todo el día)",local:"Dobrý den",pron:"Dob-rí den",tip:"El más versátil · saludo formal de todo el día"},
   {cat:"👋 Hola (informal)",local:"Ahoj",pron:"A-joy",tip:"Informal y amistoso · igual que el inglés 'ahoy'"},
   {cat:"🙏 Por favor",local:"Prosím",pron:"Pro-sím",tip:"También 'aquí tienes' y respuesta a 'gracias'"},
   {cat:"😊 Gracias",local:"Děkuji",pron:"Dyé-ku-yi",tip:"Informal: Díky (Dí-ki) · muy común"},
   {cat:"🍺 ¡Salud!",local:"Na zdraví!",pron:"Na zdra-ví",tip:"¡Imprescindible! · mira a los ojos al brindar"},
  ]},
  mapa:{centro:"Vltava River Prague",pois:[["Puente de Carlos","Charles Bridge Prague"],["Casa Danzante","Dancing House Prague"],["Rudolfinum","Rudolfinum Prague"],["Vysehrad","Vysehrad Fortress Prague"]]},
  video:{t:"Prague Vltava River Night Cruise - Romantic Tour",u:"https://www.youtube.com/watch?v=v_XlJVJaVHc"}
 },
 {id:"rot",wlat:49.3774,wlon:10.1798,name:"Rothenburg ob der Tauber",flag:"🇩🇪",
  precio:"$90 USD",base:"Desde Núremberg · 100 km · 1h",
  desc:"El Castillo Rojo sobre el Río Tauber. Entramos por debajo de la Torre de Entrada y nos saludan las casas típicas de Alemania medieval con filas de flores en las fachadas. Veremos el edificio del Ayuntamiento y la Torre Defensiva. La visita a Rothenburg ob der Tauber es una experiencia única.",
  atractivos:[
   ["Torre de Entrada (Rödertor)","entrada principal a la ciudad amurallada medieval"],
   ["Ayuntamiento (Rathaus)","renacentista del s.XIII con torre panorámica · en la Marktplatz"],
   ["Torre Defensiva","parte del sistema de murallas medievales perfectamente conservado"],
   ["Murallas medievales","3.5 km caminables en perfecto estado de conservación · vistas al valle"],
   ["Käthe Wohlfahrt","la tienda de navidad más famosa del mundo · abierta todo el año"],
  ],
  recomendados:[
   ["Tour del Guardián Nocturno","recorrido vespertino guiado por las murallas al atardecer · muy popular"],
   ["Kriminalmuseum","museo de justicia medieval con instrumentos de tortura del s.XIII"],
  ],
  gastronomia:["Schneeballen: bolas de masa frita espolvoreadas con azúcar · el dulce local icónico","Schäufele: paleta de cerdo al horno con costra crujiente · receta franconiana","Cordero asado con guarnición medieval en restaurantes de la plaza"],
  restaurantes:[
   ["Restaurantes en la Marktplatz","plaza central medieval · menús turísticos con cocina franconiana"],
   ["Café en la muralla","cafés dentro de las torres de la muralla con vistas al valle"],
  ],
  saludos:{idioma:"Alemán (Deutsch) · dialecto franconiano",nota:"Rothenburg es 100% alemana. El dialecto local tiene influencia franconiana pero el alemán estándar funciona perfectamente.",frases:[
   {cat:"🌅 Buenos días",local:"Guten Morgen",pron:"Gú-ten Mór-jen",tip:"Estándar y siempre correcto"},
   {cat:"👋 Hola (franconiano)",local:"Grüß Gott",pron:"Grüs Got",tip:"Saludo tradicional bávaro-franconiano"},
   {cat:"🙏 Por favor",local:"Bitte",pron:"Bí-te",tip:"Universal en toda Alemania"},
   {cat:"😊 Gracias",local:"Danke schön",pron:"Dán-ke shön",tip:"También: Vergelt's Gott en dialecto local"},
   {cat:"🍺 ¡Salud!",local:"Prost!",pron:"Prost",tip:"Con cerveza franconiana · la experiencia completa"},
  ]},
  mapa:{centro:"Rothenburg ob der Tauber Germany",pois:[["Ayuntamiento","Rothenburg Rathaus"],["Torre de Entrada","Rödertor Rothenburg"],["Murallas medievales","Medieval Walls Rothenburg"],["Käthe Wohlfahrt","Kathe Wohlfahrt Rothenburg"]]},
  video:{t:"Rothenburg ob der Tauber - Most Beautiful Medieval Town in Germany",u:"https://www.youtube.com/watch?v=3ZSjMaJSaM0"}
 },
 {id:"lxp",wlat:49.6116,wlon:6.1319,name:"Ciudad de Luxemburgo",flag:"🇱🇺",
  precio:"$54 USD",base:"Desde Metz · 55 km · 45 min",
  desc:"Luxemburgo, la capital del Gran Ducado de Luxemburgo, uno de los estados más pequeños de Europa, cuya capital se encuentra ubicada sobre un peñón. Durante nuestro recorrido veremos los edificios del Palacio Gran Ducal, la Legislatura Nacional, la Abadía de Neumünster y el pintoresco valle del Río Alzette.",
  atractivos:[
   ["Palacio Gran Ducal","residencia oficial del Gran Duque · cambio de guardia · arquitectura renacentista española"],
   ["Legislatura Nacional (Chambre des Députés)","parlamento del Gran Ducado de Luxemburgo"],
   ["Abadía de Neumünster","antigua abadía benedictina convertida en centro cultural"],
   ["Valle del Río Alzette","pintoresco valle que rodea la ciudad · vistas desde la Corniche"],
   ["Casamatas del Bock","21 km de túneles subterráneos excavados en roca · Patrimonio UNESCO"],
  ],
  recomendados:[
   ["Chemin de la Corniche","'el balcón más bello de Europa' · vistas panorámicas sobre el Alzette"],
   ["Casco Antiguo (Ville Haute)","Patrimonio UNESCO · callejuelas medievales perfectamente conservadas"],
  ],
  gastronomia:["Judd mat Gaardebounen: cuello de cerdo ahumado con habas · plato nacional luxemburgués","Gromperekichelcher: tortitas de papa especiadas · street food típico","Vinos del Mosela luxemburgués en bodegas del centro · blancos secos excelentes"],
  restaurantes:[
   ["Restaurantes en la Place d'Armes","plaza central · muchas opciones gastronómicas"],
   ["Mercado Guillaume","productos locales frescos · ambiente animado"],
  ],
  saludos:{idioma:"Luxemburgués · Francés · Alemán",nota:"Luxemburgo tiene 3 idiomas oficiales. El francés es el más práctico. Un saludo en luxemburgués es muy especial.",frases:[
   {cat:"🌅 Buenos días (lux.)",local:"Gudde Moien",pron:"Gú-de Móy-en",tip:"El saludo más especial que puedes dar"},
   {cat:"☀️ Buen día (fr.)",local:"Bonjour",pron:"Bon-yur",tip:"Seguro y universal en toda la ciudad"},
   {cat:"🙏 Por favor (fr.)",local:"S'il vous plaît",pron:"Sil-vu-plé",tip:"Imprescindible en tiendas y cafés"},
   {cat:"😊 Gracias",local:"Merci",pron:"Mer-sí",tip:"Igual en los 3 idiomas"},
   {cat:"🍺 ¡Salud!",local:"Prost! / Santé!",pron:"Prost / San-té",tip:"Prost alemán y Santé francés · los dos son correctos"},
  ]},
  mapa:{centro:"Luxembourg City Luxembourg",pois:[["Palacio Gran Ducal","Grand Ducal Palace Luxembourg"],["Abadía Neumünster","Neumünster Abbey Luxembourg"],["Casamatas del Bock","Bock Casemates Luxembourg"],["Chemin de la Corniche","Corniche Luxembourg"]]},
  video:{t:"Luxembourg City - Hidden Gem of Europe Guide",u:"https://www.youtube.com/watch?v=Z1jvCnUTKnE"}
 },
 {id:"str",wlat:48.5734,wlon:7.7521,name:"Estrasburgo y Colmar",flag:"🇫🇷",
  precio:"$186 USD",base:"Desde Metz · 215 km · 2h",
  desc:"En Estrasburgo veremos la arquitectura medieval con sus diseños blanco-negros, la iglesia estilo antiguo románico, la enorme catedral estilo gótico y los famosos puentes sobre el Rin. Entrando a la ciudad francesa de Colmar veremos la Iglesia de San Martín, la Casa Pfister, la Casa de las Cabezas y los numerosos canales con sus orillas cubiertas de flores.",
  atractivos:[
   ["Catedral de Notre-Dame (Estrasburgo)","gótica del s.XIV · 142 m · estilo gótico · una de las más altas del mundo"],
   ["Arquitectura medieval blanco-negra","entramado de madera alsaciano · diseños únicos en Europa"],
   ["Puentes sobre el Rin","vista panorámica de los famosos puentes entre Francia y Alemania"],
   ["Iglesia de San Martín (Colmar)","iglesia gótica del s.XIII · corazón del casco histórico de Colmar"],
   ["Casa Pfister (Colmar)","edificio del s.XVI · joya del Renacimiento alsaciano"],
   ["Casa de las Cabezas (Colmar)","fachada decorada con 106 cabezas grotescas del s.XVII"],
   ["Canales con flores (Colmar)","barrio de la Pequeña Venecia · canales bordeados de flores · muy fotogénico"],
  ],
  recomendados:[
   ["Barrio Petite France (Estrasburgo)","canales y casas de entramado medieval · Patrimonio UNESCO · el más fotogénico"],
   ["Barrio Petite Venise (Colmar)","los canales de Colmar son más pintorescos que los de Estrasburgo"],
  ],
  gastronomia:["Choucroute garnie: chucrut con embutidos y papas · el plato regional definitivo de Alsacia","Flammekueche (Tarte flambée): pizza alsaciana con crema, cebolla y lardons","Kougelhopf: bizcocho alsaciano con almendras y pasas · ideal para llevar","Vinos de Alsacia: Riesling y Gewürztraminer · los mejores de Francia"],
  restaurantes:[
   ["Winstubs de Estrasburgo","restaurantes tradicionales alsacianos · ambiente íntimo y auténtico"],
   ["Restaurantes junto a los canales de Colmar","terraza sobre el agua · choucroute y vinos locales"],
  ],
  saludos:{idioma:"Francés (Français) · Alsacia",nota:"Alsacia tiene una identidad única entre Francia y Alemania. El francés es el idioma oficial pero muchos hablan alemán y dialecto alsaciano.",frases:[
   {cat:"🌅 Buenos días",local:"Bonjour",pron:"Bon-yur",tip:"El saludo más importante en Francia · siempre antes de cualquier pregunta"},
   {cat:"🙏 Por favor",local:"S'il vous plaît",pron:"Sil-vu-plé",tip:"Obligatorio antes de pedir cualquier cosa"},
   {cat:"😊 Gracias",local:"Merci beaucoup",pron:"Mer-sí bo-kú",tip:"Beaucoup = mucho · solo Merci también es perfecto"},
   {cat:"🍺 ¡Salud!",local:"Santé!",pron:"San-té",tip:"Obligatorio mirar a los ojos · tradición francesa"},
   {cat:"😋 ¡Buen provecho!",local:"Bon appétit!",pron:"Bon a-pe-tí",tip:"Dilo al sentarse a comer"},
  ]},
  mapa:{centro:"Strasbourg France",pois:[["Catedral Notre-Dame Estrasburgo","Strasbourg Cathedral"],["Barrio Petite France","Petite France Strasbourg"],["Iglesia San Martín Colmar","Eglise Saint-Martin Colmar"],["Pequeña Venecia Colmar","Petite Venise Colmar"]]},
  video:{t:"Strasbourg & Colmar - Alsace France Complete Guide",u:"https://www.youtube.com/watch?v=Jl-X3_bAk-Y"}
 },
 {id:"brug",wlat:51.2093,wlon:3.2247,name:"Brujas y Gante",flag:"🇧🇪",
  precio:"$114 USD",base:"Brujas: 96 km (1h) · Gante: 55 km (35min) desde Bruselas",
  desc:"La ciudad belga de Brujas es una de las perlas de la arquitectura europea. El edificio más destacado que se puede ver contra el encaje de estrechas calles medievales y canales es el asombroso Campanario de Brujas. Gante es otra ciudad belga famosa en Europa. Durante nuestra visita gozaremos de la vista de estos edificios que siguen rodeando las orillas de los dos ríos como las cuentas de un exquisito collar.",
  atractivos:[
   ["Campanario de Brujas (Belfort)","83 m · símbolo de Brujas · Patrimonio UNESCO · vistas desde la cima"],
   ["Calles medievales y canales de Brujas","la 'Venecia del Norte' · encaje de adoquines y puentes del s.XIII"],
   ["Orillas de los dos ríos (Gante)","Lys y Escalda · edificios históricos flanqueando las riberas"],
   ["Graslei y Korenlei (Gante)","los dos muelles más fotogénicos de Gante · guildhalls medievales"],
   ["Castillo de los Condes (Gante)","Gravensteen · castillo medieval del s.XII · perfectamente conservado"],
  ],
  recomendados:[
   ["Paseo en barco por los canales de Brujas","ver la ciudad desde el agua · imprescindible · 30 min"],
   ["Mercado de chocolate de Gante","el mejor chocolate belga artesanal · tiendas en el centro histórico"],
  ],
  gastronomia:["Carbonnade flamande: guiso de ternera con cerveza belga · plato tradicional de Brujas","Waterzooi de Gante: guiso cremoso de pollo o pescado · el plato nacional de Gante","Gaufres de Bruselas y Lieja: waffles belgas auténticos · en puestos de la calle","Cerveza trapense belga: más de 1,500 variedades · Bruges Zot y Gentse Strop son locales"],
  restaurantes:[
   ["Restaurantes en el Burg (Brujas)","plaza histórica principal · cocina flamenca tradicional"],
   ["Restaurantes en Graslei (Gante)","frente al canal · ambiente único · cocina gantoise"],
  ],
  saludos:{idioma:"Neerlandés (Flamenco) · Francés",nota:"Brujas y Gante están en Flandes (región flamenca). El neerlandés/flamenco es el idioma principal. Un saludo en flamenco abre todas las puertas.",frases:[
   {cat:"🌅 Buenos días",local:"Goedemorgen",pron:"Jú-de-mor-jen",tip:"En flamenco · igual que en Amsterdam"},
   {cat:"👋 Hola (informal)",local:"Hoi / Dag",pron:"Jói / Daj",tip:"Dag es más típico de Flandes que de Amsterdam"},
   {cat:"🙏 Por favor",local:"Alstublieft",pron:"Als-tú-blift",tip:"Imprescindible en tiendas y cafés"},
   {cat:"😊 Gracias",local:"Dank u wel",pron:"Dank ú vel",tip:"Formal · informal: Dank je (dank ye)"},
   {cat:"🍺 ¡Salud!",local:"Proost!",pron:"Próost",tip:"Con cerveza belga · la experiencia completa"},
  ]},
  mapa:{centro:"Bruges Belgium",pois:[["Campanario de Brujas","Belfort Bruges"],["Canales de Brujas","Bruges Canals"],["Graslei Gante","Graslei Ghent"],["Castillo de los Condes","Gravensteen Ghent"]]},
  video:{t:"Bruges & Ghent Belgium - Complete Medieval Cities Guide",u:"https://www.youtube.com/watch?v=Teh5OGhLKQ0"}
 },
 {id:"wie",wlat:49.9839,wlon:20.0550,name:"Minas de sal de Wieliczka",flag:"🇵🇱",
  precio:"$95 USD",base:"Desde Cracovia · 15 km · 20 min",
  desc:"Por su grandeza estas minas que siguen produciendo sal desde el siglo XIII han recibido el nombre de La Catedral Subterránea. Tienen profundidad de 327 metros y longitud de más de 300 km. Durante el recorrido se pueden ver estatuas de personajes míticos e históricos, esculpidas en las rocas de sal por los mineros.",
  atractivos:[
   ["Capilla de Santa Kinga","capilla esculpida completamente en roca de sal · la más impresionante del mundo subterráneo"],
   ["Estatuas de sal","esculturas de personajes míticos e históricos esculpidas por los mineros"],
   ["Lago subterráneo","espejos de agua salada verde · paisaje único"],
   ["Profundidad de 327 metros","9 niveles · más de 300 km de galerías"],
   ["Patrimonio UNESCO","en la lista desde 1978 · una de las primeras minas del mundo en recibirlo"],
  ],
  recomendados:[
   ["Visita guiada oficial","obligatoria · los guías tienen acceso a zonas especiales"],
   ["Ruta del minero","alternativa más aventurera · en zonas menos turísticas"],
  ],
  gastronomia:["Obwarzanek krakowski: rosquilla trenzada · ícono gastronómico de Cracovia desde el siglo XIV","Pierogi de Cracovia: versión local con rellenos distintos · los mejores de Polonia","Restaurantes en el pueblo de Wieliczka · cocina polaca tradicional a precios locales"],
  restaurantes:[
   ["Restaurante dentro de las minas","restaurante subterráneo a 135 m de profundidad · experiencia única"],
   ["Restaurantes en Wieliczka","pueblo adyacente · cocina polaca auténtica"],
  ],
  saludos:{idioma:"Polaco (Polski)",nota:"Cualquier intento en polaco genera enorme simpatía en los locales de Wieliczka.",frases:[
   {cat:"🌅 Buenos días",local:"Dzień dobry",pron:"Yén do-bri",tip:"Funciona todo el día · el saludo más seguro"},
   {cat:"🙏 Por favor",local:"Proszę",pron:"Pró-she",tip:"También significa 'aquí tienes' y 'de nada'"},
   {cat:"😊 Gracias",local:"Dziękuję",pron:"Yen-kú-ye",tip:"Versión rápida: Dzięki (Yén-ki)"},
   {cat:"🍺 ¡Salud!",local:"Na zdrowie!",pron:"Na zdró-vye",tip:"El brindis polaco · cerveza polaca excelente"},
  ]},
  mapa:{centro:"Wieliczka Salt Mine Poland",pois:[["Entrada principal Wieliczka","Wieliczka Salt Mine entrance"],["Capilla Santa Kinga","Chapel of St Kinga Wieliczka"],["Pueblo de Wieliczka","Wieliczka town center"]]},
  video:{t:"Wieliczka Salt Mine - Underground Cathedral Poland Tour",u:"https://www.youtube.com/watch?v=QiPmCkPkGy0"}
 },
 {id:"kv",wlat:50.2316,wlon:12.8716,name:"Karlovy Vary",flag:"🇨🇿",
  precio:"$90 USD",base:"Desde Praga · 130 km · 1h 30min",
  desc:"Karlovy Vary es uno de los más famosos balnearios europeos, ubicado en la confluencia de los ríos Eger y Teplá. Tendremos un paseo para disfrutar de su pintoresca arquitectura y naturaleza.",
  atractivos:[
   ["Fuentes termales","12 fuentes · cada una con temperatura y propiedades minerales distintas"],
   ["Colonada Mill (Mlýnská kolonáda)","la más grande e imponente · neorrenacentista · s.XIX"],
   ["Colonada del Mercado","la más antigua y animada · en el centro del balneario"],
   ["Arquitectura del s.XIX","elegantes edificios de época que albergaron a reyes, escritores y músicos"],
   ["Río Teplá","paseo junto al río entre los grandes hoteles balnearios"],
  ],
  recomendados:[
   ["Catar las fuentes termales","llevar taza especial (becherovka cup) · cada fuente tiene sabor distinto"],
   ["Licor Becherovka","el famoso licor de hierbas creado en Karlovy Vary en 1807 · visitar la fábrica"],
  ],
  gastronomia:["Oplatky: obleas de oblea de spa · el souvenir comestible de Karlovy Vary · en todos los puestos","Becherovka: licor de hierbas amargo · creado aquí en 1807 · probar en la fuente original","Cocina checa tradicional: svíčková, guláš y knedlíky en los restaurantes del centro"],
  restaurantes:[
   ["Restaurantes en la Colonada","frente a las fuentes · ambiente elegante de balneario"],
   ["Cafés del centro histórico","arquitectura de época · café checo y pasteles locales"],
  ],
  saludos:{idioma:"Checo (Čeština)",nota:"La ciudad de spa más elegante de Chequia. Los checos aprecian mucho el intento de hablar su idioma.",frases:[
   {cat:"👋 Hola (todo el día)",local:"Dobrý den",pron:"Dob-rí den",tip:"El más versátil · saludo formal de todo el día"},
   {cat:"👋 Hola (informal)",local:"Ahoj",pron:"A-joy",tip:"Informal y amistoso · muy común entre jóvenes"},
   {cat:"🙏 Por favor",local:"Prosím",pron:"Pro-sím",tip:"También 'aquí tienes' y respuesta a 'gracias'"},
   {cat:"😊 Gracias",local:"Děkuji",pron:"Dyé-ku-yi",tip:"Informal: Díky (Dí-ki)"},
   {cat:"🍺 ¡Salud!",local:"Na zdraví!",pron:"Na zdra-ví",tip:"Brindis checo · mira a los ojos"},
  ]},
  mapa:{centro:"Karlovy Vary Czech Republic",pois:[["Colonada Mill","Mlynska Kolonada Karlovy Vary"],["Fuentes termales","Hot Springs Karlovy Vary"],["Colonada del Mercado","Market Colonnade Karlovy Vary"]]},
  video:{t:"Karlovy Vary Czech Republic - Spa Town Complete Guide",u:"https://www.youtube.com/watch?v=B4MuEKO1UNE"}
 },
 {id:"mun",wlat:48.1351,wlon:11.5820,name:"Múnich",flag:"🇩🇪",
  precio:"$174 USD",base:"Desde Núremberg · 170 km · 1h 45min",
  desc:"La ciudad de Múnich existe en las orillas del río Isar por lo menos 4,000 años. Durante nuestro recorrido por las calles reales veremos los edificios de la Catedral de Múnich, el Ayuntamiento con sus elaboradas torretas y esculturas de maestría, y la Feldherrnhalle — logia dedicada al ejército de Baviera con su bellísima decoración.",
  atractivos:[
   ["Catedral de Múnich (Frauenkirche)","dos torres gemelas de 99 m · símbolo de la ciudad · s.XV"],
   ["Ayuntamiento Nuevo (Neues Rathaus)","elaboradas torretas y esculturas · el Glockenspiel toca a las 11h y 12h"],
   ["Feldherrnhalle","logia neorrenacentista dedicada al ejército de Baviera · exquisita decoración"],
   ["Marienplatz","plaza central de Múnich · corazón de la ciudad desde el s.XIII"],
   ["Hofbräuhaus","la cervecería más famosa del mundo · fundada en 1589 por el Duque de Baviera"],
  ],
  recomendados:[
   ["Jardín Inglés (Englischer Garten)","el parque urbano más grande del mundo · surfistas en el río Eisbach"],
   ["Mercado de la Victoria (Viktualienmarkt)","mercado gourmet al aire libre · desde 1807 · gastronomía bávara"],
  ],
  gastronomia:["Weisswurst: salchicha blanca bávara · se come solo antes del mediodía · con pretzel y mostaza dulce","Schweinshaxe: codillo de cerdo asado · piel crujiente · acompañado de chucrut y knödel","Masa (cerveza) en el Hofbräuhaus · la experiencia bávara definitiva · litros de 1 euro en Oktoberfest"],
  restaurantes:[
   ["Hofbräuhaus","la cervecería más famosa del mundo · turístico pero auténtico"],
   ["Viktualienmarkt","mercado gourmet con puestos de comida bávara tradicional"],
  ],
  saludos:{idioma:"Alemán (Deutsch) · dialecto bávaro",nota:"Múnich tiene su propio dialecto bávaro muy marcado. Un saludo local genera gran simpatía.",frases:[
   {cat:"🌅 Buenos días",local:"Guten Morgen",pron:"Gú-ten Mór-jen",tip:"Estándar y siempre correcto"},
   {cat:"👋 Hola (bávaro)",local:"Grüß Gott",pron:"Grüs Got",tip:"El saludo tradicional bávaro · 'Dios te salude'"},
   {cat:"👋 Hola (muy informal)",local:"Servus",pron:"Sér-vus",tip:"Muy típico de Múnich · casual y cercano"},
   {cat:"🙏 Por favor",local:"Bitte",pron:"Bí-te",tip:"Universal en toda Alemania"},
   {cat:"🍺 ¡Salud!",local:"Prost!",pron:"Prost",tip:"En el Hofbräuhaus con un Mass (litro) de cerveza"},
  ]},
  mapa:{centro:"Munich Germany",pois:[["Frauenkirche","Frauenkirche Munich"],["Ayuntamiento Nuevo","Neues Rathaus Munich"],["Feldherrnhalle","Feldherrnhalle Munich"],["Hofbräuhaus","Hofbrauhaus Munich"],["Marienplatz","Marienplatz Munich"]]},
  video:{t:"Munich Germany - Top Things To Do Complete Travel Guide",u:"https://www.youtube.com/watch?v=e3R9rxgSTOE"}
 },
 {id:"noc",wlat:50.0755,wlon:14.4378,name:"Noche Checa con cena",flag:"🇨🇿",
  precio:"$90 USD",base:"En Praga (noche)",
  desc:"Capturaremos el espíritu edificante del folclore checo durante un espectáculo folclórico tradicional de 2 horas que incluye la cena. Se trata de una forma realmente diferente y entretenida de pasar una noche en Praga.",
  atractivos:[
   ["Espectáculo folclórico checo","2 horas de danzas y música tradicional bohemia en vivo"],
   ["Cena incluida","menú completo de cocina checa tradicional · 3 platos · bebidas locales"],
   ["Música en vivo","instrumentos tradicionales checos · acordeón, violín y percusión bohemia"],
   ["Trajes regionales","los artistas visten trajes folclóricos auténticos de distintas regiones checas"],
  ],
  recomendados:[
   ["Pedir cerveza checa local","la mejor cerveza del mundo · Pilsner Urquell o Budvar · incluida o a muy bajo costo"],
   ["Svíčková en la cena","el plato estrella checo · lomo en salsa de crema con knedlíky"],
  ],
  gastronomia:["Cena checa incluida en el tour · 3 platos tradicionales","Svíčková na smetaně: lomo en salsa de crema con knedlíky · plato nacional checo","Pilsner Urquell o Budvar: la mejor cerveza del mundo · disponible a bordo","Trdelník: pastel enrollado en palo · postre tradicional bohemio"],
  restaurantes:[
   ["Local del espectáculo folclórico","cena incluida en el precio del tour · cocina checa auténtica"],
  ],
  saludos:{idioma:"Checo (Čeština)",nota:"Una noche folclórica checa es la experiencia cultural más auténtica de Praga. Los anfitriones aprecian el intento de hablar checo.",frases:[
   {cat:"😊 Gracias",local:"Děkuji",pron:"Dyé-ku-yi",tip:"Para agradecer la cena y el espectáculo"},
   {cat:"🍺 ¡Salud!",local:"Na zdraví!",pron:"Na zdra-ví",tip:"El brindis obligatorio · mira a los ojos"},
   {cat:"😋 ¡Buen provecho!",local:"Dobrou chuť",pron:"Dob-rou khut",tip:"Antes de la cena checa"},
   {cat:"👏 ¡Bravo!",local:"Výborně!",pron:"Ví-bor-nye",tip:"Para aplaudir al espectáculo folclórico"},
  ]},
  mapa:{centro:"Prague Czech Republic",pois:[["Centro de Praga","Prague Old Town Square"],["Teatro de folclore","Prague folk show restaurants"]]},
  video:{t:"Czech Folk Evening - Traditional Prague Dinner Show",u:"https://www.youtube.com/watch?v=v_XlJVJaVHc"}
 },
 {id:"bar",wlat:50.1109,wlon:8.6821,name:"Barco por el Río Meno",flag:"🇩🇪",
  precio:"$42 USD",base:"En Frankfurt (desde el Römerberg)",
  desc:"Este paseo ofrece una oportunidad única de observar la vida en el frenético centro comercial y financiero desde la tranquilidad del poderoso Río Meno.",
  atractivos:[
   ["Skyline financiero de Frankfurt","los rascacielos del distrito financiero vistos desde el agua · contraste único"],
   ["Römerberg desde el río","el casco histórico medieval visto desde perspectiva acuática"],
   ["Orillas del Meno (Museumsufer)","paseo de museos a lo largo del río · la ribera más cultural de Alemania"],
   ["Puentes históricos del Meno","varios puentes históricos peatonales con vistas al centro"],
  ],
  recomendados:[
   ["Combinar con visita al Römerberg","hacer el barco después de visitar el centro histórico a pie"],
   ["Atardecer en el Meno","el crucero al atardecer con el skyline iluminado es especialmente impresionante"],
  ],
  gastronomia:["Ebbelwoi (Apfelwein): vino de manzana de Frankfurt · sabor ácido · en las tabernas de Sachsenhausen","Grüne Soße: salsa verde de 7 hierbas frescas · especialidad única de Frankfurt","Handkäse mit Musik: queso fuerte con cebolla y vinagreta · el aperitivo hessiano por excelencia"],
  restaurantes:[
   ["Tabernas de Sachsenhausen","barrio de las sidrerías · cruzando el Meno desde el centro"],
   ["Restaurantes en el Römerberg","plaza histórica central · cocina alemana tradicional"],
  ],
  saludos:{idioma:"Alemán (Deutsch) · dialecto hessiano",nota:"Frankfurt es la ciudad más cosmopolita de Alemania. El inglés es muy hablado pero un saludo en alemán siempre abre puertas.",frases:[
   {cat:"👋 Hola (hessiano)",local:"Guude!",pron:"Gú-de",tip:"El saludo típico de Frankfurt · muy local y apreciado"},
   {cat:"🙏 Por favor",local:"Bitte",pron:"Bí-te",tip:"Multiuso: pedir, agradecer y entregar"},
   {cat:"😊 Gracias",local:"Danke",pron:"Dán-ke",tip:"Rápido y efectivo"},
   {cat:"🍺 ¡Salud!",local:"Prost! / Ebbelwei!",pron:"Prost / É-bel-vai",tip:"Ebbelwei es el vino de manzana de Frankfurt"},
  ]},
  mapa:{centro:"Main River Frankfurt Germany",pois:[["Embarque barco Meno","Main River Cruise Frankfurt"],["Römerberg","Römerberg Frankfurt"],["Sachsenhausen","Sachsenhausen Frankfurt"],["Museumsufer","Museum Embankment Frankfurt"]]},
  video:{t:"Frankfurt Main River Cruise - Financial City from the Water",u:"https://www.youtube.com/watch?v=7cMyFVEvKSk"}
 },
 {id:"sch",wlat:49.4667,wlon:6.3667,name:"Ciudad de Schengen",flag:"🇱🇺",
  precio:"$54 USD",base:"Desde Metz · 60 km · 50 min",
  desc:"Schengen es una de las localidades más conocidas en el mundo de hoy. Aquí se unen las fronteras de Luxemburgo, Alemania y Francia, y fue aquí donde se firmó el Acuerdo de Schengen bajo el cual varios países europeos suprimieron los controles en las fronteras entre sí, estableciendo un espacio de circulación libre de personas y bienes.",
  atractivos:[
   ["Monumento al Acuerdo de Schengen","en la orilla del Mosela · donde se unen las tres fronteras"],
   ["Confluencia de tres países","Luxemburgo, Alemania y Francia · se pueden ver los tres países desde un punto"],
   ["Museo Europeo de Schengen","documenta la historia del acuerdo y la Europa sin fronteras"],
   ["Río Mosela","pintoresco río fronterizo · paseo en las orillas entre viñedos"],
   ["Viñedos del Mosela","vinos blancos de Luxemburgo en las laderas junto al río"],
  ],
  recomendados:[
   ["Pisar los tres países","existe un punto exacto donde puedes tener un pie en cada país"],
   ["Crucero por el Mosela","pequeño crucero fluvial por el río fronterizo · paisaje de viñedos"],
  ],
  gastronomia:["Vinos blancos del Mosela luxemburgués · Riesling y Pinot Gris · excelentes","Judd mat Gaardebounen: plato nacional de Luxemburgo en restaurantes locales","Cocina de la Mosela: mezcla de influencias francesas, alemanas y luxemburguesas"],
  restaurantes:[
   ["Restaurantes en Schengen","cocina de la región fronteriza · vinos del Mosela locales"],
   ["Bodegas del Mosela","cata de vinos luxemburgueses directamente en las bodegas"],
  ],
  saludos:{idioma:"Luxemburgués · Francés · Alemán",nota:"Schengen es el símbolo de la Europa unida. Los tres idiomas se hablan con fluidez. Cualquier saludo en cualquiera de ellos funciona.",frases:[
   {cat:"🌅 Buenos días (lux.)",local:"Gudde Moien",pron:"Gú-de Móy-en",tip:"El más especial · luxemburgués en tierra luxemburguesa"},
   {cat:"☀️ Buenos días (fr.)",local:"Bonjour",pron:"Bon-yur",tip:"Seguro y universal"},
   {cat:"☀️ Buenos días (al.)",local:"Guten Tag",pron:"Gú-ten Tak",tip:"Para el lado alemán de la frontera"},
   {cat:"🍺 ¡Salud!",local:"Prost! / Santé!",pron:"Prost / San-té",tip:"Con vino del Mosela · los tres países brindan así"},
  ]},
  mapa:{centro:"Schengen Luxembourg",pois:[["Monumento Schengen","Schengen Monument Luxembourg"],["Museo Europeo","European Museum Schengen"],["Confluencia tres fronteras","Schengen tripoint border"]]},
  video:{t:"Schengen Village - Where Europe Without Borders Was Born",u:"https://www.youtube.com/watch?v=Z1jvCnUTKnE"}
 },
 {id:"vol",wlat:52.4946,wlon:5.0703,name:"Volendam, Marken y La Haya",flag:"🇳🇱",
  precio:"$138 USD",base:"Desde Ámsterdam: Volendam 22 km · La Haya 60 km",
  desc:"Esta visita nos sumerge en la vida diaria de los pescadores de los Países Bajos, con sus típicas casas de madera de colores y vistas al IJsselmeer. La ciudad de La Haya (Den Haag) es la capital administrativa del Reino de los Países Bajos, situada en la costa del Mar del Norte. La Haya contemporánea asombra a sus visitantes con las vistas de sus rascacielos impresionantes y el Binnenhof. Paseando por las calles del casco histórico veremos las lujosas residencias de personajes importantes, la Catedral y el Palacio de la Paz.",
  atractivos:[
   ["Volendam","pueblo pesquero con casas de madera de colores · trajes tradicionales holandeses · fotogénico"],
   ["Marken","isla-pueblo en el IJsselmeer · arquitectura tradicional única · sin coches"],
   ["Binnenhof (La Haya)","complejo histórico del parlamento neerlandés · s.XIII · en uso continuo"],
   ["Palacio de la Paz (La Haya)","sede de la Corte Internacional de Justicia de la ONU"],
   ["Catedral de La Haya","imponente catedral neogótica en el centro histórico"],
   ["Rascacielos de La Haya","contraste impresionante entre el centro histórico y los modernos rascacielos"],
  ],
  recomendados:[
   ["Foto con traje tradicional en Volendam","los fotógrafos locales tienen trajes auténticos · souvenir único"],
   ["Mauritshuis (La Haya)","museo con 'La Joven de la Perla' de Vermeer · una de las pinturas más famosas del mundo"],
  ],
  gastronomia:["Haring fresco en Volendam directamente del puerto · el más fresco de los Países Bajos","Stroopwafels artesanales en mercados locales · recién hechos son infinitamente mejores","Poffertjes: mini panqueques con mantequilla y azúcar · en puestos de Volendam"],
  restaurantes:[
   ["Restaurantes en el puerto de Volendam","pescado fresco del IJsselmeer · ambiente marinero auténtico"],
   ["Restaurantes en el centro de La Haya","cocina neerlandesa e internacional · elegante y cosmopolita"],
  ],
  saludos:{idioma:"Neerlandés (Nederlands)",nota:"El neerlandés es la lengua oficial. El inglés lo habla casi todo el mundo, pero un saludo local siempre causa buena impresión.",frases:[
   {cat:"🌅 Buenos días",local:"Goedemorgen",pron:"Jú-de-mor-jen",tip:"Úsalo hasta aprox. las 12:00"},
   {cat:"👋 Hola (informal)",local:"Hoi / Hallo",pron:"Jói / Já-lo",tip:"Hoi es muy común entre jóvenes"},
   {cat:"🙏 Por favor",local:"Alstublieft",pron:"Als-tú-blift",tip:"A menudo abreviado como s.v.p. en señales"},
   {cat:"😊 Gracias",local:"Dank u wel",pron:"Dank ú vel",tip:"Informal: Dank je (dank ye)"},
   {cat:"🍺 ¡Salud!",local:"Proost!",pron:"Próost",tip:"Al brindar · muy común en bares"},
  ]},
  mapa:{centro:"Volendam Netherlands",pois:[["Puerto de Volendam","Volendam harbor Netherlands"],["Marken","Marken island Netherlands"],["Binnenhof La Haya","Binnenhof The Hague"],["Palacio de la Paz","Peace Palace The Hague"]]},
  video:{t:"Volendam & The Hague - Day Trip from Amsterdam",u:"https://www.youtube.com/watch?v=sn9dVPMvk1A"}
 },
];


const distMain=[
 {de:"Ámsterdam",a:"Hannover",km:280,t:"2h 30min"},
 {de:"Hannover",a:"Berlín",km:288,t:"2h 45min"},
 {de:"Berlín",a:"Varsovia",km:575,t:"5h 30min"},
 {de:"Varsovia",a:"Cracovia",km:300,t:"3h 00min"},
 {de:"Cracovia",a:"Praga",km:540,t:"5h 15min"},
 {de:"Praga",a:"Núremberg",km:360,t:"3h 30min"},
 {de:"Núremberg",a:"Frankfurt",km:230,t:"2h 15min"},
 {de:"Frankfurt",a:"Luxemburgo",km:220,t:"2h 15min"},
 {de:"Luxemburgo",a:"Metz",km:55,t:"45min"},
 {de:"Metz",a:"Bruselas",km:310,t:"3h 00min"},
 {de:"Bruselas",a:"Ámsterdam",km:210,t:"2h 00min"},
];
const distTours=[
 {de:"Berlín",a:"Potsdam",km:35,t:"35min"},
 {de:"Cracovia",a:"Auschwitz-Birkenau",km:75,t:"1h 15min"},
 {de:"Cracovia",a:"Minas Wieliczka",km:15,t:"20min"},
 {de:"Núremberg",a:"Rothenburg ob der Tauber",km:100,t:"1h 00min"},
 {de:"Núremberg",a:"Múnich",km:170,t:"1h 45min"},
 {de:"Metz",a:"Estrasburgo",km:215,t:"2h 00min"},
 {de:"Estrasburgo",a:"Colmar",km:75,t:"45min"},
 {de:"Metz",a:"Ciudad de Schengen",km:60,t:"50min"},
 {de:"Praga",a:"Karlovy Vary",km:130,t:"1h 30min"},
 {de:"Bruselas",a:"Gante",km:55,t:"30min"},
 {de:"Bruselas",a:"Brujas",km:95,t:"1h 00min"},
 {de:"Ámsterdam",a:"Volendam/Marken",km:22,t:"25min"},
 {de:"Ámsterdam",a:"La Haya (Den Haag)",km:60,t:"50min"},
];

let curView='home',curCity=0,curSub='itinerario',curTour=0;

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
 const tabs=[['itinerario','📋 Del itinerario'],['recomendados','⭐ Recomendados'],['gastronomia','🍽️ Gastronomía'],['restaurantes','🍴 Dónde comer'],['saludos','🗣️ Saludos'],['mapa','🗺️ Mapa'],['fotos','📸 Fotos'],['clima','🌤️ Clima'],['video','📺 Video']];
 document.getElementById('sub-pills').innerHTML=tabs.map(s=>
  `<button class="subpill${curSub===s[0]?' active':''}" onclick="selS('${s[0]}')">${s[1]}</button>`
 ).join('');
 renderCityBody();
}

function renderCityBody(){
 const c=cities[curCity];let h='';
 if(c.libre.length) h+=`<div class="libre-box"><p>🗓️ ${c.libre[0]}</p></div>`;
 if(c.tourPersonal) h+=`<div class="tp-box"><div class="tpt">🌟 Tour personal sugerido</div><p>${c.tourPersonal}</p></div>`;
 if(curSub==='itinerario'){
  h+=`<div class="card"><div class="card-header"><div class="card-title">${c.flag} ${c.name}</div><div class="card-sub">${c.country} · ${c.days}<br><span style="color:var(--gold)">${c.dates}</span></div><div class="tag">${c.moneda} · ${c.cambio}</div></div>`;
  h+=`<div class="section-label">Atractivos que incluye el tour</div>`;
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
  h+=`<div class="card"><div class="card-header"><div class="card-title">⭐ Recomendados adicionales</div><div class="card-sub">No incluidos en el tour · visitar por tu cuenta en tiempo libre</div></div>`;
  h+=`<div class="section-label">Atractivos adicionales recomendados</div>`;
  h+=c.atractivos_recomendados.map(a=>`<div class="list-item"><span class="lb2">◇</span><div class="list-text">${a[0]}<div class="list-sub">${a[1]}</div></div></div>`).join('');
  h+='</div>';
  h+=renderNotes(c.id,'recomendados');
 } else if(curSub==='gastronomia'){
  h+=`<div class="card"><div class="card-header"><div class="card-title">🍽️ Gastronomía típica</div></div>`;
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
  h+=`<div class="card"><div class="card-header"><div class="card-title">🗣️ Frases útiles en ${s.idioma}</div><div class="card-sub">${s.nota}</div></div>`;
  h+=s.frases.map(f=>`<div class="saludo-row"><div class="saludo-cat">${f.cat}</div><div class="saludo-local">${f.local}</div><div class="saludo-pron">🔊 <em>${f.pron}</em></div><div class="saludo-tip">💡 ${f.tip}</div></div>`).join('');
  h+='</div>';
 } else if(curSub==='mapa'){
  const m=c.mapa;
  h+=`<div class="card"><div class="card-header"><div class="card-title">🗺️ Mapa de ${c.name}</div><div class="card-sub">Toca cualquier lugar para abrirlo en Google Maps</div></div>`;
  h+=`<a class="vlink" href="${m.url}" target="_blank" rel="noopener" style="background:rgba(201,168,76,0.08)"><div class="pbtn" style="background:var(--gold);color:#0f1923">📍</div><div style="flex:1"><div class="vtitle">Ver mapa general de ${c.name}</div><div class="vdesc">Abre Google Maps centrado en el casco histórico</div></div></a>`;
  h+=`<div class="section-label">📌 Lugares del itinerario</div>`;
  h+=m.pois.map(p=>`<a class="map-poi" href="https://www.google.com/maps/search/?api=1&query=${p[1]}" target="_blank" rel="noopener"><span class="poi-icon">📍</span><div class="poi-name">${p[0]}</div><span class="poi-arrow">↗</span></a>`).join('');
  h+='</div>';
 } else if(curSub==='fotos'){
  h+=renderFotos(c.id,c.name);
 } else if(curSub==='clima'){
  h+=`<div class="card"><div class="card-header"><div class="card-title">🌤️ Clima en ${c.name}</div><div class="card-sub">Actualiza automáticamente con señal · guarda último dato offline</div></div><div id="city-wx-body-${c.id}" style="padding:20px;text-align:center;color:var(--dim);font-size:13px">⏳ Cargando clima...</div></div>`;
  if(c.wlat){setTimeout(()=>fetchWeather(c.id,c.name,c.wlat,c.wlon,'city-wx-body-'+c.id),50);}
 } else if(curSub==='video'){
  const savedVidUrl=localStorage.getItem('cityvid_url_'+c.id);
  const savedVidTitle=localStorage.getItem('cityvid_title_'+c.id);
  const displayUrl=savedVidUrl||c.video.u;
  const displayTitle=savedVidTitle||c.video.t;
  const displayCanal=savedVidUrl?'Video personalizado':c.video.canal;
  const displayDesc=savedVidUrl?'Video agregado manualmente':c.video.d;
  h+=`<div class="card"><div class="card-header"><div class="card-title">📺 Video de ${c.name}</div><div class="card-sub">Toca para ver en YouTube · puedes cambiar el enlace</div></div>`;
  if(displayUrl){
   h+=`<a class="vlink" href="${displayUrl}" target="_blank" rel="noopener"><div class="pbtn">▶</div><div><div class="vtitle">${displayTitle}</div><div class="vdesc">${displayDesc}</div><div style="font-size:12px;color:var(--gold);margin-top:4px">Canal: ${displayCanal}</div></div></a>`;
  } else {
   h+=`<div style="padding:14px;text-align:center;color:var(--dim);font-size:13px">No hay video asignado. Agrega un enlace abajo.</div>`;
  }
  h+=`<div class="note-add" style="border-top:1px solid rgba(201,168,76,0.15)">
   <div style="font-size:12px;color:var(--gold);margin-bottom:4px;font-weight:500">✏️ Cambiar video:</div>
   <input type="url" id="cityvid-url-${c.id}" placeholder="https://www.youtube.com/watch?v=..." value="${displayUrl||''}" style="width:100%;background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:8px 10px;font-size:13px;color:var(--cream);font-family:inherit;outline:none;box-sizing:border-box;margin-bottom:6px">
   <input type="text" id="cityvid-title-${c.id}" placeholder="Título del video (opcional)" value="${displayTitle||''}" style="width:100%;background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:8px 10px;font-size:13px;color:var(--cream);font-family:inherit;outline:none;box-sizing:border-box">
   <div style="display:flex;gap:8px;margin-top:8px">
    <button class="note-add-btn" style="flex:1" onclick="saveCityVideo('${c.id}')">💾 Guardar</button>
    <button class="note-add-btn" style="flex:0.6;background:rgba(255,80,80,0.08);border-color:rgba(255,80,80,0.35);color:#ff6464" onclick="deleteCityVideo('${c.id}')">🗑 Eliminar</button>
   </div>
   ${savedVidUrl?'<div style="font-size:10px;color:var(--gold);margin-top:6px;text-align:center">⚡ Video personalizado activo · el original queda guardado en el código</div>':''}
  </div></div>`;
 }
 document.getElementById('city-body').innerHTML=h;
}
function saveCityVideo(cityId){
 const urlInp=document.getElementById('cityvid-url-'+cityId);
 const titleInp=document.getElementById('cityvid-title-'+cityId);
 if(!urlInp)return;
 const url=urlInp.value.trim();
 const title=titleInp?titleInp.value.trim():'';
 if(!url){alert('Por favor ingresa un enlace de YouTube');return;}
 if(!url.includes('youtube')&&!url.includes('youtu.be')){alert('Por favor ingresa un enlace de YouTube válido');return;}
 localStorage.setItem('cityvid_url_'+cityId,url);
 if(title)localStorage.setItem('cityvid_title_'+cityId,title);
 renderCityBody();
}
function deleteCityVideo(cityId){
 if(!confirm('¿Eliminar el video personalizado y volver al original?'))return;
 localStorage.removeItem('cityvid_url_'+cityId);
 localStorage.removeItem('cityvid_title_'+cityId);
 renderCityBody();
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
 const isTour=cityId.startsWith('tour_');
 const sectionTitle={itinerario:'itinerario',recomendados:'recomendados',gastronomia:'gastronomía',restaurantes:'dónde comer',tour:'excursión'}[section]||section;
 let h='<div class="card notes-card">';
 h+=`<div class="card-header"><div class="card-title">📝 Mis notas · ${sectionTitle}</div><div class="card-sub">Solo en este teléfono · ${notes.length} ${notes.length===1?'nota':'notas'} · toca para editar</div></div>`;
 if(notes.length){
  h+=notes.map((n,i)=>`
   <div class="note-row" id="note-row-${cityId}-${section}-${i}">
    <div class="note-content" onclick="editNote('${cityId}','${section}',${i})" style="cursor:pointer" title="Toca para editar">
     <div id="note-text-${cityId}-${section}-${i}">${escapeHtml(n.text)}</div>
     <div class="note-date">${n.date} · ✏️ toca para editar</div>
    </div>
    <button class="note-del" onclick="delNote('${cityId}','${section}',${i})">🗑</button>
   </div>
   <div id="note-edit-${cityId}-${section}-${i}" style="display:none;padding:8px 14px;background:rgba(94,203,122,0.05);border-bottom:1px solid rgba(94,203,122,0.15)">
    <textarea id="note-edit-ta-${cityId}-${section}-${i}" style="width:100%;background:var(--bg);border:1px solid #5ecb7a;border-radius:8px;padding:8px;font-size:14px;color:var(--cream);font-family:inherit;outline:none;resize:vertical;box-sizing:border-box">${escapeHtml(n.text)}</textarea>
    <div style="display:flex;gap:8px;margin-top:6px">
     <button class="note-add-btn" style="flex:1" onclick="saveEditNote('${cityId}','${section}',${i})">💾 Guardar cambio</button>
     <button class="note-add-btn" style="flex:0.5;background:rgba(100,100,100,0.1);border-color:var(--border);color:var(--muted)" onclick="cancelEditNote('${cityId}','${section}',${i})">✕ Cancelar</button>
    </div>
   </div>`).join('');
 } else {
  h+=`<div style="padding:12px 14px;font-size:13px;color:var(--dim);text-align:center">No has agregado notas todavía.<br>Úsalas como diario del viaje 📔</div>`;
 }
 h+=`<div class="note-add">
  <textarea id="note-input-${cityId}-${section}" placeholder="Escribe una nota (restaurante recomendado, lugar visto, etc.)" rows="2"></textarea>
  <button class="note-add-btn" onclick="addNote('${cityId}','${section}')">➕ Agregar nota</button>
 </div>`;
 h+='</div>';
 return h;
}
function attachNoteEdit(cityId,section){}
function editNote(cityId,section,idx){
 const editDiv=document.getElementById(`note-edit-${cityId}-${section}-${idx}`);
 const textDiv=document.getElementById(`note-text-${cityId}-${section}-${idx}`);
 if(!editDiv)return;
 editDiv.style.display=editDiv.style.display==='none'?'block':'none';
}
function saveEditNote(cityId,section,idx){
 const ta=document.getElementById(`note-edit-ta-${cityId}-${section}-${idx}`);
 if(!ta)return;
 const text=ta.value.trim();
 if(!text)return;
 const notes=getNotes(cityId,section);
 if(!notes[idx])return;
 notes[idx].text=text;
 const now=new Date();
 notes[idx].date=now.toLocaleDateString('es-MX',{day:'numeric',month:'short'})+' · '+now.toLocaleTimeString('es-MX',{hour:'2-digit',minute:'2-digit'})+' (editada)';
 saveNotes(cityId,section,notes);
 if(cityId.startsWith('tour_'))renderTourBody();else renderCityBody();
}
function cancelEditNote(cityId,section,idx){
 const editDiv=document.getElementById(`note-edit-${cityId}-${section}-${idx}`);
 if(editDiv)editDiv.style.display='none';
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
 if(cityId.startsWith('tour_'))renderTourBody();else renderCityBody();
}
function delNote(cityId,section,idx){
 if(!confirm('¿Borrar esta nota?'))return;
 const notes=getNotes(cityId,section);
 notes.splice(idx,1);
 saveNotes(cityId,section,notes);
 if(cityId.startsWith('tour_'))renderTourBody();else renderCityBody();
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
   counter.innerHTML=`${photos.length}/10 ${photos.length===1?'foto':'fotos'}${isOver?' <span style="color:#ffa552">⚠ excede recomendado</span>':''}`;
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
   <div class="card-title">📸 Mis fotos de ${cityName}</div>
   <div class="card-sub">Solo en este teléfono · <span id="photo-counter-${cityId}">cargando...</span> · Recomendado: máx. 10 por ciudad</div>
  </div>
  <div id="photo-status-${cityId}" class="photo-status"></div>
  <div class="photo-grid" id="photo-grid-${cityId}">
   <div style="padding:14px;font-size:13px;color:var(--dim);text-align:center;grid-column:1/-1">Cargando fotos...</div>
  </div>
  <div class="photo-add">
   <input type="file" id="photo-input-${cityId}" accept="image/*" multiple style="display:none" onchange="uploadPhotos('${cityId}',this.files)">
   <button class="photo-add-btn" onclick="document.getElementById('photo-input-${cityId}').click()">📷 Subir fotos</button>
   <div style="font-size:11px;color:var(--dim);text-align:center;margin-top:6px">Las originales en tu rollo no se modifican · esto es una copia comprimida</div>
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
   if(status)status.innerHTML=`⏳ Procesando ${done} de ${list.length}...`;
  }catch(err){
   console.log('photo upload err:',err);
  }
 }
 if(status){status.innerHTML=`✅ ${done} ${done===1?'foto agregada':'fotos agregadas'}`;setTimeout(()=>{status.style.display='none';},2200);}
 renderCityBody();
}
async function delPhotoUI(id){
 if(!confirm('¿Borrar esta foto?'))return;
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
  if(counter)counter.textContent=docs.length+' '+(docs.length===1?'documento':'documentos');
  if(docs.length===0){
   grid.innerHTML='<div style="padding:18px 14px;font-size:13px;color:var(--dim);text-align:center">No has subido documentos todavía.<br>Toca el botón dorado para agregar un PDF.</div>';
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
   <div class="card-title">📄 Documentos de ${cityName}</div>
   <div class="card-sub">Solo en este teléfono · <span id="doc-counter-${cityId}">cargando...</span></div>
  </div>
  <div id="doc-status-${cityId}" class="photo-status"></div>
  <div id="doc-list-${cityId}">
   <div style="padding:14px;font-size:13px;color:var(--dim);text-align:center">Cargando documentos...</div>
  </div>
  <div class="doc-add">
   <input type="file" id="doc-input-${cityId}" accept=".pdf,application/pdf" multiple style="display:none" onchange="uploadDocs('${cityId}',this.files)">
   <button class="doc-add-btn" onclick="document.getElementById('doc-input-${cityId}').click()">📎 Subir PDF</button>
   <div style="font-size:11px;color:var(--dim);text-align:center;margin-top:6px">Toca para abrir · guarda boletos, vouchers, reservaciones</div>
  </div>
 </div>`;
}
async function uploadDocs(cityId,files){
 if(!files||!files.length)return;
 const status=document.getElementById('doc-status-'+cityId);
 const list=Array.from(files);
 let done=0;
 if(status){status.innerHTML=`⏳ Guardando ${done} de ${list.length}...`;status.style.display='block';}
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
   if(status)status.innerHTML=`⏳ Guardando ${done} de ${list.length}...`;
  }catch(err){console.log('doc upload err:',err);}
 }
 if(status){status.innerHTML=`✅ ${done} ${done===1?'documento guardado':'documentos guardados'}`;setTimeout(()=>{status.style.display='none';},2200);}
 if(cityId==='home'){
  // Refresh home list
  const docs=await getDocs('home');
  const counter=document.getElementById('doc-counter-home');
  const list=document.getElementById('doc-list-home');
  if(counter)counter.textContent=docs.length+' '+(docs.length===1?'documento':'documentos');
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
 if(!confirm('¿Borrar este documento?'))return;
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

let curTourSub='info';
function renderTours(){
 // No more packages — all tours are independent
 document.getElementById('pkg-pills').innerHTML=''; // hide pkg pills
 document.getElementById('tour-pills').innerHTML=tours.map((t,i)=>
  `<button class="pill${i===curTour?' active':''}" onclick="selT(${i})">${t.flag} ${t.name.split(' ')[0]}</button>`
 ).join('');
 const tourTabs=[['info','📋 Info'],['recomendados','⭐ Recomendados'],['gastronomia','🍽️ Gastronomía'],['restaurantes','🍴 Dónde comer'],['saludos','🗣️ Saludos'],['mapa','🗺️ Mapa'],['fotos','📸 Fotos'],['clima','🌤️ Clima'],['video','📺 Video']];
 document.getElementById('tour-subtabs').innerHTML=tourTabs.map(s=>
  `<button class="subpill${curTourSub===s[0]?' active':''}" onclick="selTS('${s[0]}')">${s[1]}</button>`
 ).join('');
 renderTourBody();
}
function renderTourBody(){
 const t=tours[curTour];
 let h='';
 // Notas section appended at end of every tab
 const notasH=renderNotes('tour_'+t.id,'tour');
 if(curTourSub==='info'){
  h+=`<div class="card"><div class="card-header"><div class="card-title">${t.flag} ${t.name}</div><div class="card-sub">${t.base}</div><span class="tag" style="background:rgba(201,168,76,0.15);color:var(--gold2)">${t.precio}</span></div>`;
  if(t.desc)h+=`<div style="padding:12px 14px;font-size:14px;color:var(--cream);line-height:1.7;border-bottom:1px solid rgba(201,168,76,0.1)">${t.desc}</div>`;
  h+=`<div class="section-label">Lugares y atractivos principales</div>`;
  h+=t.atractivos.map(a=>`<div class="list-item"><span class="lb">◆</span><div class="list-text">${a[0]}<div class="list-sub">${a[1]}</div></div></div>`).join('');
  h+='</div>';
  h+=notasH;
 } else if(curTourSub==='recomendados'){
  h+=`<div class="card"><div class="card-header"><div class="card-title">⭐ Recomendados en ${t.name}</div></div>`;
  const recs=t.recomendados||[];
  if(recs.length){
   h+=recs.map(a=>`<div class="list-item"><span class="lb2">◇</span><div class="list-text">${a[0]}<div class="list-sub">${a[1]}</div></div></div>`).join('');
  }else{
   h+=`<div style="padding:14px;font-size:13px;color:var(--dim);text-align:center">Sin recomendados adicionales</div>`;
  }
  h+='</div>';
  h+=notasH;
 } else if(curTourSub==='gastronomia'){
  h+=`<div class="card"><div class="card-header"><div class="card-title">🍽️ Gastronomía en ${t.name}</div></div>`;
  h+=t.gastronomia.map(g=>`<div class="list-item"><span class="lb">◆</span><span class="list-text">${g}</span></div>`).join('');
  h+='</div>';
  h+=notasH;
 } else if(curTourSub==='restaurantes'){
  h+=`<div class="card"><div class="card-header"><div class="card-title">🍴 Dónde comer en ${t.name}</div></div>`;
  const rests=t.restaurantes||[];
  if(rests.length){
   h+=rests.map(r=>`<div class="list-item"><span class="lb">◆</span><div class="list-text">${r[0]}<div class="list-sub">${r[1]}</div></div></div>`).join('');
  }else{
   h+=`<div style="padding:14px;font-size:13px;color:var(--dim);text-align:center">Sin restaurantes registrados aún</div>`;
  }
  h+='</div>';
  h+=notasH;
 } else if(curTourSub==='saludos'){
  const s=t.saludos;
  h+=`<div class="card"><div class="card-header"><div class="card-title">🗣️ Frases útiles en ${s.idioma}</div><div class="card-sub">${s.nota}</div></div>`;
  h+=s.frases.map(f=>`<div class="list-item"><span class="lb">◆</span><div class="list-text"><span style="color:var(--gold2);font-weight:500">${f.cat}</span><div style="font-size:15px;color:var(--cream);margin:3px 0">${f.local}</div><div style="font-size:12px;color:var(--gold);font-style:italic">Pronunciación: ${f.pron}</div><div class="list-sub">${f.tip}</div></div></div>`).join('');
  h+='</div>';
  h+=notasH;
 } else if(curTourSub==='mapa'){
  const m=t.mapa||{centro:t.name,pois:[]};
  const murl=`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(m.centro)}`;
  h+=`<div class="card"><div class="card-header"><div class="card-title">🗺️ Mapa de ${t.name}</div><div class="card-sub">Toca cualquier lugar para abrirlo en Google Maps</div></div>`;
  h+=`<a class="map-poi" href="${murl}" target="_blank" rel="noopener"><span class="poi-icon">🗺️</span><span class="poi-name">Ver mapa general de ${t.name}</span><span class="poi-arrow">›</span></a>`;
  if(m.pois&&m.pois.length){
   h+=`<div class="section-label">📌 Lugares de interés</div>`;
   h+=m.pois.map(p=>`<a class="map-poi" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p[1])}" target="_blank" rel="noopener"><span class="poi-icon">📍</span><span class="poi-name">${p[0]}</span><span class="poi-arrow">›</span></a>`).join('');
  }
  h+='</div>';
  h+=notasH;
 } else if(curTourSub==='fotos'){
  h+=renderPhotos(t.id,t.name);
  h+=notasH;
 } else if(curTourSub==='clima'){
  h+=`<div class="card" id="tour-wx-${t.id}"><div class="card-header"><div class="card-title">🌤️ Clima en ${t.name}</div><div class="card-sub">Actualiza con señal · último dato guardado si offline</div></div><div id="tour-wx-body-${t.id}" style="padding:20px;text-align:center;color:var(--dim);font-size:13px">⏳ Cargando clima...</div></div>`;
  if(t.wlat){setTimeout(()=>fetchWeather(t.id,t.name,t.wlat,t.wlon,'tour-wx-body-'+t.id),50);}
  else{setTimeout(()=>{const el=document.getElementById('tour-wx-body-'+t.id);if(el)el.innerHTML='Sin datos de ubicación.';},50);}
  h+=notasH;
 } else if(curTourSub==='video'){
  h+=renderTourVideo(t);
  h+=notasH;
 }
 document.getElementById('tour-body').innerHTML=h;
}
function selP(i){} // no longer used
function selT(i){curTour=i;curTourSub='info';renderTours();}
function selTS(s){curTourSub=s;
 const tourTabs=[['info','📋 Info'],['recomendados','⭐ Recomendados'],['gastronomia','🍽️ Gastronomía'],['restaurantes','🍴 Dónde comer'],['saludos','🗣️ Saludos'],['mapa','🗺️ Mapa'],['fotos','📸 Fotos'],['clima','🌤️ Clima'],['video','📺 Video']];
 document.getElementById('tour-subtabs').innerHTML=tourTabs.map(st=>
  `<button class="subpill${curTourSub===st[0]?' active':''}" onclick="selTS('${st[0]}')">${st[1]}</button>`
 ).join('');
 renderTourBody();
}
function renderTourVideo(t){
 const savedUrl=localStorage.getItem('tourvid_'+t.id);
 const vid=t.video||null;
 const displayUrl=savedUrl||(vid?vid.u:'');
 const displayTitle=savedUrl?'Video personalizado':(vid?vid.t:'Video del destino');
 let h=`<div class="card"><div class="card-header"><div class="card-title">📺 Video de ${t.name}</div><div class="card-sub">Toca para abrir en YouTube · puedes personalizar el enlace</div></div>`;
 if(displayUrl){
  h+=`<a class="vlink" href="${displayUrl}" target="_blank" rel="noopener"><div class="pbtn">▶</div><div><div class="vtitle">${displayTitle}</div><div style="font-size:11px;color:var(--gold);margin-top:4px">📺 Toca para ver en YouTube</div></div></a>`;
 }else{
  h+=`<div style="padding:14px;text-align:center;color:var(--dim);font-size:13px">No hay video asignado. Agrega un enlace abajo.</div>`;
 }
 h+=`<div class="note-add" style="border-top:1px solid rgba(201,168,76,0.15)">
  <div style="font-size:12px;color:var(--gold);margin-bottom:6px;font-weight:500">✏️ Cambiar enlace de YouTube:</div>
  <input type="url" id="vid-input-${t.id}" placeholder="https://www.youtube.com/watch?v=..." value="${displayUrl}" style="width:100%;background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:8px 10px;font-size:13px;color:var(--cream);font-family:inherit;outline:none;box-sizing:border-box">
  <div style="display:flex;gap:8px;margin-top:8px">
   <button class="note-add-btn" style="flex:1" onclick="saveTourVideo('${t.id}')">💾 Guardar</button>
   <button class="note-add-btn" style="flex:0.6;background:rgba(255,80,80,0.08);border-color:rgba(255,80,80,0.35);color:#ff6464" onclick="deleteTourVideo('${t.id}')">🗑 Eliminar</button>
  </div>
 </div></div>`;
 return h;
}
function saveTourVideo(tid){
 const inp=document.getElementById('vid-input-'+tid);
 if(!inp)return;
 const url=inp.value.trim();
 if(url&&!url.includes('youtube')&&!url.includes('youtu.be'))return alert('Por favor ingresa un enlace de YouTube válido');
 if(url)localStorage.setItem('tourvid_'+tid,url);
 renderTourBody();
}
function deleteTourVideo(tid){
 if(!confirm('¿Eliminar el enlace de video?'))return;
 localStorage.removeItem('tourvid_'+tid);
 renderTourBody();
}


function renderDist(){
 const total=distMain.reduce((s,r)=>s+r.km,0);
 let h=`<div class="dist-row" style="background:rgba(201,168,76,0.07)"><span class="dcity" style="color:var(--gold)">Total del circuito</span><span></span><span class="dkm" style="color:var(--gold)">${total.toLocaleString()} km</span><span class="dtime"></span></div>`;
 h+=distMain.map(r=>`<div class="dist-row"><span class="dcity">${r.de}</span><span style="color:var(--dim);font-size:11px">→</span><span class="dcity" style="color:var(--cream)">${r.a}</span><span class="dkm">${r.km} km</span><span class="dtime">&nbsp;${r.t}</span></div>`).join('');
 document.getElementById('dist-main-card').innerHTML=h;
 document.getElementById('dist-tour-card').innerHTML=distTours.map(r=>
  `<div class="dist-row"><span class="dcity">${r.de}</span><span style="color:var(--dim);font-size:11px">→</span><span class="dcity" style="color:var(--cream)">${r.a}</span><span class="dkm">${r.km} km</span><span class="dtime">&nbsp;${r.t}</span></div>`
 ).join('');
}

function renderMonedas(){
 // Use real-time rates if available
 const liveEUR=window._EUR||EUR;
 const livePLN=window._PLN||PLN;
 const liveCZK=window._CZK||CZK;
 const fxTs=parseInt(localStorage.getItem('fx_ts')||'0');
 const fxAge=fxTs?Math.round((Date.now()-fxTs)/60000):null;
 const fxLabel=fxTs?(fxAge<1?'ahora mismo':fxAge<60?`hace ${fxAge} min`:`hace ${Math.round(fxAge/60)}h`):'fijo (sin señal)';
 const isLive=fxTs&&fxAge<120;
 document.getElementById('monedas-card').innerHTML=`
  <div style="padding:8px 14px;font-size:11px;color:${isLive?'#5ecb7a':'#ffa552'};background:${isLive?'rgba(94,203,122,0.06)':'rgba(255,165,82,0.06)'};border-bottom:1px solid var(--border);display:flex;align-items:center;gap:6px">
   ${isLive?'🔄':'📴'} Tipo de cambio actualizado ${fxLabel} · ${isLive?'en tiempo real':'sin internet, usando último dato'}
   ${isLive?'':`<button onclick="fetchExchangeRates().then(ok=>{if(ok)renderMonedas();})" style="margin-left:auto;background:transparent;border:1px solid #ffa552;color:#ffa552;padding:2px 8px;border-radius:4px;font-size:10px;cursor:pointer">🔄 Actualizar</button>`}
  </div>
  <div class="curr-row"><div class="csym">€</div><div><div class="cname">Euro</div><div class="crate">1 € = $${liveEUR.toFixed(2)} MXN</div><div class="cnote">🇳🇱🇩🇪🇫🇷🇧🇪🇱🇺 Países Bajos, Alemania, Francia, Bélgica, Luxemburgo</div></div></div>
  <div class="curr-row"><div class="csym">zł</div><div><div class="cname">Złoty polaco (PLN)</div><div class="crate">1 zł = $${livePLN.toFixed(2)} MXN · 100 zł ≈ $${(livePLN*100).toFixed(0)} MXN</div><div class="cnote">🇵🇱 Polonia (Varsovia y Cracovia) · Es UE pero NO usa euro</div></div></div>
  <div class="curr-row"><div class="csym">Kč</div><div><div class="cname">Corona checa (CZK)</div><div class="crate">1 Kč = $${liveCZK.toFixed(2)} MXN · 100 Kč ≈ $${(liveCZK*100).toFixed(0)} MXN</div><div class="cnote">🇨🇿 República Checa (Praga) · No adoptó el euro</div></div></div>`;
 // Update rates for calculator too
 window.ratesToMXN={MXN:1,EUR:liveEUR,PLN:livePLN,CZK:liveCZK,USD:17.28};
 calcUpdate();
 // Auto-refresh if has signal
 if(navigator.onLine&&(!fxTs||fxAge>25)){
  fetchExchangeRates().then(ok=>{if(ok)renderMonedas();});
 }
}
// Tasas vs MXN (cuántos MXN vale 1 unidad)
const USD_MXN=17.28;
const ratesToMXN={MXN:1,EUR:EUR,PLN:PLN,CZK:CZK,USD:USD_MXN};
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
 return n.toLocaleString('es-MX',{minimumFractionDigits:dec,maximumFractionDigits:dec});
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
 const inMXN=v*(window.ratesToMXN||ratesToMXN)[from];
 const targets=['MXN','EUR','PLN','CZK','USD'].filter(c=>c!==from);
 out.innerHTML=targets.map(c=>{
  const result=inMXN/(window.ratesToMXN||ratesToMXN)[c];
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
 {d:"1",wd:"Dom",dt:"6 Sep",c:"✈️ México → Ámsterdam",n:"Vuelo trasatlántico · noche a bordo",tipo:"normal",
  full:`Presentarse en el Aeropuerto Internacional de la Ciudad de México 3 horas antes para tomar el vuelo trasatlántico con destino a Ámsterdam. Noche a bordo.`},
 {d:"2",wd:"Lun",dt:"7 Sep",c:"🇳🇱 Ámsterdam",n:"Llegada · recepción · recorrido panorámico",tipo:"normal",
  full:`Llegada a Ámsterdam, la capital del Reino de los Países Bajos. Por su belleza, el casco histórico de Ámsterdam está incluido en la Lista del Patrimonio Mundial de la UNESCO. Después del recorrido por la ciudad, recepción y traslado al hotel. Alojamiento.`},
 {d:"3",wd:"Mar",dt:"8 Sep",c:"🇳🇱→🇩🇪 Ámsterdam · Hannover · Berlín",n:"Desayuno · parada Hannover · llegada Berlín",tipo:"normal",
  full:`Desayuno. Después nos dirigimos a la ciudad de Hannover en la República Federal de Alemania. Situada en orilla del río Leine la ciudad lleva el nombre con este mismo significado "La Orilla Alta". Hannover fue fundada en época medieval por barqueros, pescadores y comerciantes que llevaban los barcos llenos de mercancías por el río. Durante nuestro recorrido veremos los bellos edificios del Palacio de la Opera, las ruinas de la iglesia San Gil (Aegidienkirche), la Iglesia del Mercado, los edificios del Ayuntamiento, Nuevo y Viejo. Luego seguiremos hacia la ciudad de Berlín, la capital de la República Federal de Alemania. Alojamiento.`},
 {d:"4",wd:"Mié",dt:"9 Sep",c:"🇩🇪 Berlín",n:"Recorrido panorámico · opt. Potsdam (Paq.1)",tipo:"normal",
  full:`Desayuno. Realizaremos una breve visita panorámica de Berlín. Situada en las orillas de dos ríos, Spree y Havel que confluyen dentro de la ciudad, Berlín ofrece unas vistas inolvidables. Durante nuestro recorrido vamos a ver la Plaza Gendarmenmarkt, La Puerta de Brandenburgo, Potsdamer Platz, Frauenkirche, el Palacio Zwinger, la Terraza Bruhl, el Camino del Rey, la Estatua de Martín Lutero y gozar de la belleza majestuosa de la milenaria ciudad. Alojamiento.`,
  opcionales:["Ciudad de Potsdam"]},
 {d:"5",wd:"Jue",dt:"10 Sep",c:"🇩🇪→🇵🇱 Berlín · Varsovia",n:"Desayuno · viaje · recorrido Ciudad Vieja UNESCO",tipo:"normal",
  full:`Desayuno. Después nos dirigimos a la ciudad de Varsovia, la capital de la República de Polonia. Nadie sabe cuándo apareció el pequeño pueblo de pescadores que desde el siglo XIII se convirtió en una de las ciudades más hermosas del mundo. La Ciudad Vieja – su casco histórico está incluido en la Lista del Patrimonio de la Humanidad de la UNESCO. Durante nuestro recorrido veremos el Castillo Real, la famosa Columna de Segismundo, la hermosa Iglesia de las Visitacionistas, también denominada iglesia de las Hermanas de la Visitación de San José de Varsovia de la Orden de la Visitación. Alojamiento.`},
 {d:"6",wd:"Vie",dt:"11 Sep",c:"🇵🇱 Varsovia → Cracovia",n:"Desayuno · viaje · recorrido panorámico Cracovia",tipo:"normal",
  full:`Desayuno. Después nos dirigimos a la ciudad polaca de Cracovia. Otra bella ciudad europea con su casco histórico incluido en la Lista del Patrimonio de la Humanidad de la UNESCO. Durante nuestro breve recorrido panorámico veremos el Castillo de Wawel, la increíble catedral con nombre completo de Basílica de San Estanislao y San Wenceslao con sus numerosas capillas de distintas épocas y estilos arquitectónicos, La Basílica de Santa María, El Corte Renacentista, la Plaza del Mercado y la pequeña iglesia de San Adalberto. Alojamiento.`},
 {d:"7",wd:"Sáb",dt:"12 Sep",c:"🇵🇱 Cracovia ★ DÍA LIBRE",n:"Opt. Auschwitz (Paq.1) · Wieliczka (Paq.2) · o tour personal",tipo:"libre",
  full:`Desayuno. Día libre para actividades personales o para realizar una excursión opcional. Alojamiento.`,
  opcionales:["Campo de concentración de Auschwitz–Birkenau","Minas de sal de Wieliczka"]},
 {d:"8",wd:"Dom",dt:"13 Sep",c:"🇵🇱→🇨🇿 Cracovia · Praga",n:"Desayuno · viaje · recorrido panorámico Praga",tipo:"normal",
  full:`Desayuno. Después nos dirigimos a la ciudad de Praga, la capital de la República Checa y la capital histórica de Bohemia. Construida en el siglo IX como un pequeño pueblo fronterizo en las orillas del río Moldava, en el siglo XVII-XIX llegó a tener tal esplendor que todo Europa la llamaba Praga Dorada. En nuestro tour panorámico de la ciudad pasaremos por la Plaza Vaclav Havel, que es una de las plazas más grandes de Praga, luego llegaremos a la Plaza de la Ciudad Vieja, que se encuentra entre la Plaza Vaclac Havel y el Puente Carlos (Karluv Most). En la Plaza de la Ciudad Vieja veremos la Torre del Reloj Astronómico, la Iglesia de Tyn, el Ayuntamiento Viejo, la Iglesia de San Nicolás y el Monumento a Jan Hus. Después del almuerzo continuaremos hacia la orilla opuesta de Praga. De paso veremos el Puente de Carlos, que fue construido en el siglo XIV. Alojamiento.`},
 {d:"9",wd:"Lun",dt:"14 Sep",c:"🇨🇿 Praga ★ DÍA LIBRE",n:"Opt. Barco Moldava (P1) · Karlovy Vary/Noche Checa (P2) · o personal",tipo:"libre",
  full:`Desayuno. Día libre para realizar actividades personales o posibilidad de realizar una excursión opcional. Alojamiento.`,
  opcionales:["Paseo en barco por el Río Moldava","Excursión a Karlovy Vary","Noche checa con cena tradicional"]},
 {d:"10",wd:"Mar",dt:"15 Sep",c:"🇨🇿→🇩🇪 Praga · Núremberg",n:"Desayuno · viaje · recorrido Núremberg",tipo:"normal",
  full:`Desayuno. Después nos dirigimos a la ciudad alemana de Núremberg. El fabuloso Castillo de Núremberg fue construido en lo alto de una colina hace unos mil años. En los siguientes siglos ese pintoresco complejo de edificios se convirtió en núcleo vivo de una ciudad creciendo rápidamente alrededor suyo. Durante nuestro recorrido por Núremberg veremos los impresionantes edificios de la Iglesia de Nuestra Señora, la Casa de la Opera, el Viejo Ayuntamiento y por supuesto las vistas fascinantes del río Pegnitz. Alojamiento.`},
 {d:"11",wd:"Mié",dt:"16 Sep",c:"🇩🇪 Núremberg ★ DÍA LIBRE",n:"Opt. Rothenburg (P1) · Múnich (P2) · o tour personal",tipo:"libre",
  full:`Desayuno. Día libre para realizar actividades personales o posibilidad de realizar una excursión opcional. Alojamiento.`,
  opcionales:["Ciudad Rothenburg ob der Tauber","Ciudad de Múnich"]},
 {d:"12",wd:"Jue",dt:"17 Sep",c:"🇩🇪 Núremberg → Frankfurt",n:"Desayuno · viaje · visita Frankfurt",tipo:"normal",
  full:`Desayuno. Después nos dirigimos a la ciudad de Frankfurt ubicada en el centro de Alemania a orillas del Rio Meno, importante centro financiero mundial. Los orígenes de la ciudad se pierden en lo hondo de los primeros siglos del Medioevo, pero siempre en la colina de Romer. Aquí veremos los impresionantes edificios de la familia de comerciantes Romer construidos en los siglos XIII y XIV, la iglesia de San Nicolás, la Catedral Imperial de la Colegiata de San Bartolomé y gozaremos de las majestuosas siluetas del Banco Central Europeo, el Banco de Alemania y la Bolsa de Frankfurt que son unas de las instituciones financieras más importantes del mundo. Alojamiento.`,
  opcionales:["Paseo nocturno en barco por el Río Meno"]},
 {d:"13",wd:"Vie",dt:"18 Sep",c:"🇩🇪→🇱🇺🇫🇷 Frankfurt · Luxemburgo · Metz",n:"Desayuno · parada Luxemburgo (opc.) · base Metz",tipo:"normal",
  full:`Desayuno. Después nos dirigimos a la ciudad francesa de Metz o a la ciudad francesa de Thionville. Tiempo libre para realizar excursiones opcionales a la ciudad de Luxemburgo en el estado de Gran Ducado de Luxemburgo y a la ciudad de Schengen. Alojamiento.`,
  opcionales:["Ciudad de Luxemburgo","Ciudad de Schengen"]},
 {d:"14",wd:"Sáb",dt:"19 Sep",c:"🇫🇷 Metz / Thionville ★ DÍA LIBRE",n:"Opt. Luxemburgo/Estr./Colmar (P1) · Schengen (P2) · o Metz libre",tipo:"libre",
  full:`Desayuno. Día libre para realizar actividades personales o posibilidad de realizar una excursión opcional. Alojamiento.`,
  opcionales:["Ciudad de Estrasburgo","Ciudad de Colmar"]},
 {d:"15",wd:"Dom",dt:"20 Sep",c:"🇫🇷→🇧🇪 Metz · Bruselas",n:"Desayuno · viaje · recorrido Bruselas",tipo:"normal",
  full:`Desayuno. Después nos dirigimos a la ciudad de Bruselas, la capital del Reino de Bélgica, sede la Comisión Europea, famosa por su cerveza y su chocolate. Aquí veremos la impresionante Plaza del Mercado, las galerías reales de Saint-Hubert, la escultura del Manneken Pis, el Palacio Real de Bruselas, los museos reales de Bellas Artes. Alojamiento.`},
 {d:"16",wd:"Lun",dt:"21 Sep",c:"🇧🇪 Bruselas ★ DÍA LIBRE",n:"Opt. Brujas y Gante (Paq.1) · o Bruselas por libre",tipo:"libre",
  full:`Desayuno. Día libre para realizar actividades personales o posibilidad de realizar una excursión opcional. Alojamiento.`,
  opcionales:["Ciudades de Brujas y Gante"]},
 {d:"17",wd:"Mar",dt:"22 Sep",c:"🇧🇪→🇳🇱 Bruselas · Ámsterdam ⭐ TOUR PERSONAL",n:"Si no tomas P2: Ámsterdam libre → Rijksmuseum, Jordaan, canales",tipo:"tp",
  full:`Desayuno. Después nos dirigimos a la ciudad de Ámsterdam. Tiempo libre para realizar actividades personales o bien realizar una excursión opcional. Alojamiento.`,
  opcionales:["Volendam y Marken","Ciudad de La Haya","Pueblo de Giethoorn"]},
 {d:"18",wd:"Mié",dt:"23 Sep",c:"🇳🇱 Ámsterdam → ✈️ México",n:"Desayuno · traslado aeropuerto · vuelo de regreso",tipo:"normal",
  full:`Desayuno. A la hora indicada, traslado al aeropuerto para tomar el vuelo de regreso a la Ciudad de México.`},
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

document.getElementById('tp-home-box').innerHTML=`<div class="tph">5 oportunidades identificadas en el itinerario</div>`+[
 {d:"Día 7 · Sáb 12 Sep",c:"Cracovia",n:"Si no contratas Auschwitz (P1) ni Wieliczka (P2): Barrio Kazimierz + Plaza del Mercado a tu ritmo."},
 {d:"Día 9 · Lun 14 Sep",c:"Praga",n:"Sin tours opcionales: Castillo de Praga por tu cuenta + Puente de Carlos al amanecer."},
 {d:"Día 11 · Mié 16 Sep",c:"Núremberg",n:"Sin Rothenburg ni Múnich: Tribunal de Núremberg (Sala 600) + murallas medievales caminables."},
 {d:"Día 14 · Sáb 19 Sep",c:"Metz",n:"Sin excursiones: Catedral de San Esteban + Centre Pompidou-Metz + Barrio del Temple."},
 {d:"Día 17 · Mar 22 Sep ⭐",c:"Ámsterdam (recomendada)",n:"Si no tomas P2: Ámsterdam libre para Rijksmuseum, barrio Jordaan y canales sin prisas."},
].map(t=>`<div class="tpi"><strong>${t.d} · ${t.c}</strong><br>${t.n}</div>`).join('');

// Initialize home documents
(async function initHomeDocs(){
 const docs=await getDocs('home');
 const counter=document.getElementById('doc-counter-home');
 const list=document.getElementById('doc-list-home');
 if(counter)counter.textContent=docs.length+' '+(docs.length===1?'documento':'documentos');
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
 if(!confirm('¿Borrar este documento?'))return;
 await delDoc(id);
 // Refresh home docs list
 const docs=await getDocs('home');
 const counter=document.getElementById('doc-counter-home');
 const list=document.getElementById('doc-list-home');
 if(counter)counter.textContent=docs.length+' '+(docs.length===1?'documento':'documentos');
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
