const EUR=1.085,PLN=0.255,CZK=0.044,MXN_USD=0.058;
const WEATHER_KEY='3245e1b78a27dae5478238f66be1683f';
const WEATHER_CACHE_MIN=30; // cache 30 minutes

// ===== REAL-TIME EXCHANGE RATES =====
async function fetchExchangeRates(){
 try{
  const r=await fetch('https://open.er-api.com/v6/latest/USD');
  const d=await r.json();
  if(d&&d.rates){
   // USD base rates
   window._EUR=parseFloat((1/d.rates.EUR).toFixed(4));
   window._PLN=parseFloat((1/d.rates.PLN).toFixed(4));
   window._CZK=parseFloat((1/d.rates.CZK).toFixed(4));
   window._MXN=parseFloat((1/d.rates.MXN).toFixed(4));
   localStorage.setItem('fx_eur',window._EUR);
   localStorage.setItem('fx_pln',window._PLN);
   localStorage.setItem('fx_czk',window._CZK);
   localStorage.setItem('fx_mxn',window._MXN);
   localStorage.setItem('fx_ts',Date.now());
   return true;
  }
 }catch(e){console.log('FX fetch failed',e);}
 return false;
}
// Load cached or default rates
(function initRates(){
 const ts=parseInt(localStorage.getItem('fx_ts')||'0');
 const age=(Date.now()-ts)/60000;
 if(age<60&&localStorage.getItem('fx_eur')){
  window._EUR=parseFloat(localStorage.getItem('fx_eur'));
  window._PLN=parseFloat(localStorage.getItem('fx_pln'));
  window._CZK=parseFloat(localStorage.getItem('fx_czk'));
  window._MXN=parseFloat(localStorage.getItem('fx_mxn')||MXN_USD);
 } else {
  window._EUR=EUR; window._PLN=PLN; window._CZK=CZK; window._MXN=MXN_USD;
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
    el.innerHTML='<div style="padding:14px;color:var(--dim);font-size:13px;text-align:center">No internet connection. Open the app with signal to see weather.</div>';
   }}else{
    el.innerHTML='<div style="padding:14px;color:var(--dim);font-size:13px;text-align:center">No internet connection. Open the app with signal to see weather.</div>';
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
 const agoText=ago<1?'just now':ago<60?` ${ago} min ago`:` ${Math.round(ago/60)}h`;
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
     <div style="font-size:10px;color:var(--dim);margin-bottom:2px">FEELS LIKE</div>
     <div style="font-size:15px;color:var(--cream);font-weight:500">${d.feels}°C</div>
    </div>
    <div style="background:var(--bg3);border-radius:8px;padding:10px">
     <div style="font-size:10px;color:var(--dim);margin-bottom:2px">HUMIDITY</div>
     <div style="font-size:15px;color:var(--cream);font-weight:500">${d.humidity}%</div>
    </div>
    <div style="background:var(--bg3);border-radius:8px;padding:10px">
     <div style="font-size:10px;color:var(--dim);margin-bottom:2px">WIND</div>
     <div style="font-size:15px;color:var(--cream);font-weight:500">${d.wind} km/h</div>
    </div>
    <div style="background:var(--bg3);border-radius:8px;padding:10px">
     <div style="font-size:10px;color:var(--dim);margin-bottom:2px">UPDATED</div>
     <div style="font-size:12px;color:${offline?'#ffa552':'var(--gold)'};font-weight:500">${offline?'📴 '+agoText:'🔄 '+agoText}</div>
    </div>
   </div>
   ${offline?'<div style="margin-top:10px;font-size:11px;color:#ffa552;text-align:center">⚠️ Data from last connection · open with internet to refresh</div>':''}
  </div>`;
}

// Fetch weather for tour city
function fetchWeatherForTour(tid,name,lat,lon){
 fetchWeather(tid,name,lat,lon,'tour-wx-body-'+tid);
}

const cities=[
{id:"ams",wlat:52.3676,wlon:4.9041,name:"Amsterdam",flag:"🇳🇱",country:"Netherlands",days:"Days 2-3 & 17-18",dates:"Mon Sep 7 – Tue Sep 8\nFri Sep 22 – Sat Sep 23",moneda:"Euro (€)",cambio:`1 € = $${EUR.toFixed(3)} USD`,
 libre:[],
 tourPersonal:"⭐ Day 17 (Fri Sep 22): If you skip Package 2 (Volendam, The Hague, Giethoorn) you have Amsterdam free. Perfect for the Rijksmuseum, the Jordaan neighborhood and the canals at your own pace before the Day 18 flight.",
 atractivos_itinerario:[
  ["📅 DAY 2 - Mon Sep 7","Arrival in Amsterdam · reception and hotel transfer"],
  ["Amsterdam Historic Center","UNESCO World Heritage · panoramic city tour included"],
  ["📅 DAY 3 - Tue Sep 8","Breakfast · heading to Hanover and Berlin"],
  ["📅 DAY 17 - Fri Sep 22 ⭐ PERSONAL TOUR","Free time for personal activities or an optional excursion"],
  ["Volendam & Marken (Package 2)","Picturesque fishing villages · wooden houses · traditional costumes (Package 2)"],
  ["The Hague — Den Haag (Package 2)","Seat of the Dutch government · Parliament · UN International Court of Justice"],
  ["Giethoorn Village (Package 2)","The 'Venice of the Netherlands' · no streets, only canals · only if the flight departs after 8:00 pm"],
  ["📅 DAY 18 - Sat Sep 23","Breakfast · airport transfer · return flight to Mexico City"],
 ],
 atractivos_recomendados:[
  ["Rijksmuseum","national museum with Rembrandt's Night Watch · 2.5M visits/year"],
  ["Anne Frank House","hideout where the Frank family hid from the Nazis (1942-44)"],
  ["Van Gogh Museum","200+ works by the painter organized by life stages"],
  ["Red Light District (De Wallen)","historic area with the 13th-century Oude Kerk"],
  ["Jordaan Neighborhood","picturesque canals, markets and the Westerkerk Church"],
  ["Mercado flotante de flores (Bloemenmarkt)","unique in the world · on floating houses"],
  ["Heineken Experience","interactive former brewery with beer tasting included"],
  ["Vondelpark","the most visited park in the Netherlands · 10 million visits/year"],
 ],
 gastronomia:[
  ["Haring","raw herring with onion and pickles · iconic street snack"],
  ["Stamppot","mashed potatoes with vegetables and meatballs, national dish"],
  ["Bitterballen","fried meat ragout croquettes · classic bar snack"],
  ["Stroopwafel","double cookie filled with caramel · the most iconic sweet"],
  ["Kroket (FEBO)","croquettes from vending machines from €2"],
  ["Pannenkoeken","large Dutch pancakes, sweet or savory"],
  ["Erwtensoep","thick pea soup with smoked sausage"],
  ["Kibbeling","fried fish pieces with garlic sauce"],
 ],
 restaurantes:[
  ["De Blauwe Hollander","authentic stamppot and bitterballen · Jordaan neighborhood","€10-15"],
  ["FEBO (vending)","croquettes, sausages and street snacks","€2-3"],
  ["HEMA Cafeteria","Dutch self-service · stamppot €3.50, rookworst €3.59","€3-6"],
  ["Albert Cuyp Market","market: stroopwafels, kibbeling, haring · Mon-Sat","€3-8"],
  ["Pancakes Amsterdam","Dutch pancakes in every variety","€10-13"],
 ],
 video:{t:"Top Things to Do in Amsterdam - Ultimate Travel Guide 2025",d:"Canals, museums and hidden gems - narrated English guide",canal:"Vacation Idea",u:"https://www.youtube.com/watch?v=8-9PyGEVYf8"},
 mapa:{centro:"Dam Square Amsterdam",url:"https://www.google.com/maps/search/?api=1&query=Dam+Square+Amsterdam+Netherlands",pois:[
  ["Dam Square","Plaza+Dam+Amsterdam"],
  ["Royal Palace of Amsterdam","Royal+Palace+Amsterdam"],
  ["Anne Frank House","Anne+Frank+House+Amsterdam"],
  ["Rijksmuseum","Rijksmuseum+Amsterdam"],
  ["Van Gogh Museum","Van+Gogh+Museum+Amsterdam"],
  ["Jordaan Neighborhood","Jordaan+Amsterdam"],
  ["Vondelpark","Vondelpark+Amsterdam"],
  ["Mercado Albert Cuyp","Albert+Cuypmarkt+Amsterdam"],
  ["Estación Central","Amsterdam+Centraal+Station"]
 ]},
 saludos:{idioma:"Dutch (Nederlands)",nota:"Dutch is the official language. Almost everyone speaks English — but a local greeting makes a great impression!",frases:[
  {cat:"🌅 Good morning",local:"Goedemorgen",pron:"HOO-duh-MOR-khen",tip:"Use until about noon"},
  {cat:"☀️ Good afternoon",local:"Goedemiddag",pron:"HOO-duh-MIH-dahkh",tip:"From noon until 6 pm"},
  {cat:"🌙 Good evening",local:"Goedenavond",pron:"HOO-den-AH-vont",tip:"After 6 pm"},
  {cat:"👋 Hi (informal)",local:"Hoi / Hallo",pron:"Hoy / HAH-loh",tip:"Hoi is very casual among young people"},
  {cat:"🙏 Please",local:"Alstublieft",pron:"AHL-stoo-BLEEFT",tip:"Abreviado a s.v.p. en carteles"},
  {cat:"😊 Thank you",local:"Dank u wel",pron:"DAHNK oo vel",tip:"Informal: Dank je (DAHNK yuh)"},
  {cat:"🤝 You're welcome",local:"Graag gedaan",pron:"KHRAHKH khuh-DAHN",tip:"Literally 'with pleasure'"},
  {cat:"❓ How much is it?",local:"Hoeveel kost het?",pron:"HOO-vayl kost het?",tip:"Very useful at markets and shops"},
  {cat:"🚽 Where's the restroom?",local:"Waar is het toilet?",pron:"Vahr is het twah-LET?",tip:"Look for Toiletten on signs"},
  {cat:"🍺 Cheers!",local:"Proost!",pron:"Prohst",tip:"When toasting · very common in bars"}
 ]}
},
{id:"han",wlat:52.3759,wlon:9.732,name:"Hanover",flag:"🇩🇪",country:"Germany",days:"Day 3 (transit)",dates:"Tue Sep 8 (stop on Amsterdam–Berlin route)",moneda:"Euro (€)",cambio:`1 € = $${EUR.toFixed(3)} USD`,libre:[],tourPersonal:"",
 atractivos_itinerario:[
  ["Opera House (Opernhaus)","one of Germany's most important theaters"],
  ["Ruins of the Aegidienkirche","preserved as a memorial to WWII victims"],
  ["Market Church (Marktkirche)","14th-century Gothic · symbol of the city"],
  ["New Town Hall (Neues Rathaus)","with a curved elevator unique in Europe"],
  ["Old Town Hall (Altes Rathaus)","medieval building on the historic square"],
 ],
 atractivos_recomendados:[
  ["Herrenhausen Gardens","internationally famous baroque gardens · the best in Hanover"],
  ["Línea Roja turística","painted ground route connecting 36 city attractions"],
  ["Ernst August Galerie","galería comercial frente a la estación, arquitectura destacada"],
 ],
 gastronomia:[
  ["Currywurst","sausage with curry sauce · classic German street food"],
  ["Kartoffelpuffer","fried potato cakes with apple sauce"],
  ["Bretzel","salted pretzel · typical snack with beer"],
  ["Leine Bier","emblematic local craft beer of the region"],
 ],
 restaurantes:[
  ["Markthalle Hannover","covered market with many options","€5-10"],
  ["Snack bars zona central","currywurst and pretzels on the street","€3-5"],
  ["Restaurants en Kröpcke","central square · lunch menus","€8-13"],
 ],
 video:{t:"HANNOVER Travel Guide - Tips for visiting Hanover Germany",d:"Hanover Germany top sights and travel tips - narrated English",canal:"Budget Travel Guide",u:"https://www.youtube.com/watch?v=J77oYg8wjSc"},
 mapa:{centro:"Marktplatz Hannover",url:"https://www.google.com/maps/search/?api=1&query=Marktplatz+Hannover+Germany",pois:[
  ["Opera House (Opernhaus)","Opernhaus+Hannover"],
  ["Ruinas Aegidienkirche","Aegidienkirche+Hannover"],
  ["Marktkirche (Market Church)","Marktkirche+Hannover"],
  ["New Town Hall (Neues Rathaus)","Neues+Rathaus+Hannover"],
  ["Río Leine","Leine+River+Hannover"]
 ]},
 saludos:{idioma:"German (Deutsch)",nota:"Hanoverian German is considered the purest and most neutral German. Any greeting in German is warmly appreciated.",frases:[
  {cat:"🌅 Good morning",local:"Guten Morgen",pron:"GOO-ten MOR-gen",tip:"Use until about 11 am"},
  {cat:"☀️ Good afternoon",local:"Guten Tag",pron:"GOO-ten TAHK",tip:"General daytime greeting · very common"},
  {cat:"🌙 Good evening",local:"Guten Abend",pron:"GOO-ten AH-bent",tip:"After 6 pm"},
  {cat:"👋 Hi (informal)",local:"Hallo / Moin",pron:"Já-lo / Móin",tip:"Moin is typical of northern Germany"},
  {cat:"🙏 Please",local:"Bitte",pron:"BIT-uh",tip:"Also means 'here you go' when handing something"},
  {cat:"😊 Thank you",local:"Danke schön",pron:"DAHN-kuh shurn",tip:"Just Danke also works fine"},
  {cat:"🤝 You're welcome",local:"Bitte sehr",pron:"BIT-uh zayr",tip:"Or simply Bitte"},
  {cat:"❓ How much is it?",local:"Was kostet das?",pron:"Vahs KOS-tet dahs?",tip:"Essential at shops and markets"},
  {cat:"🚽 Where's the restroom?",local:"Wo ist die Toilette?",pron:"Voh ist dee twah-LET-uh?",tip:"Look for WC on signs"},
  {cat:"🍺 Cheers!",local:"Prost!",pron:"Prohst",tip:"Classic German toast · unavoidable"}
 ]}
},
{id:"ber",wlat:52.52,wlon:13.405,name:"Berlin",flag:"🇩🇪",country:"Germany",days:"Days 3-5",dates:"Tue Sep 8 – Thu Sep 10",moneda:"Euro (€)",cambio:`1 € = $${EUR.toFixed(3)} USD`,libre:[],tourPersonal:"",
 atractivos_itinerario:[
  ["📅 DAY 3 - Tue Sep 8","Arrival in Berlin from Hanover · accommodation"],
  ["📅 DAY 4 - Wed Sep 9","Breakfast · panoramic tour of Berlin"],
  ["Gendarmenmarkt Square","considered the most beautiful square in Berlin"],
  ["Brandenburg Gate","símbolo mundial de la reunificación alemana (1989)"],
  ["Potsdamer Platz","modern square with avant-garde architecture"],
  ["Frauenkirche","church mentioned in the tour itinerary"],
  ["Zwinger Palace","18th-century baroque · dazzling architecture"],
  ["Terraza Brühl","royal promenade with river views"],
  ["King's Way","historic walk mentioned in the itinerary"],
  ["Estatua de Martín Lutero","at the Marienkirche church"],
  ["Potsdam City (Package 1)","Capital of Brandenburg · Sanssouci Palace UNESCO · summer residence of Frederick the Great"],
  ["📅 DAY 5 - Thu Sep 10","Breakfast · departure to Warsaw"],
 ],
 atractivos_recomendados:[
  ["Muro de Berlín (East Side Gallery)","the largest open-air mural in the world · 1.3 km"],
  ["Museum Island","UNESCO Heritage with 5 world-class museums"],
  ["Holocaust Memorial","2,711 concrete steles · designed by Peter Eisenman"],
  ["Reichstag","public glass dome · 360° views · free"],
  ["Checkpoint Charlie","former border crossing · Cold War symbol"],
 ],
 gastronomia:[
  ["Döner Kebab","invented in Berlin in the 1970s · the city has the world's best"],
  ["Currywurst berlinesa","sausage with ketchup and curry · the city's signature dish"],
  ["Buletten","Berlin meatballs with bread and mustard"],
  ["Berliner Pfannkuchen","rosquilla rellena de mermelada"],
  ["Schnitzel","filete empanizado · herencia austrohúngara"],
 ],
 restaurantes:[
  ["Mustafa's Gemüse Kebap","the world's most famous döner · Mehringdamm 36","€5-6"],
  ["Markthalle Neun","covered market with street food · Thursdays and Fridays","€5-10"],
  ["Spreewaldgrill","classic currywurst since 1930","€3-5"],
  ["Hackescher Markt (zona)","varied lunch menus","€9-15"],
 ],
 video:{t:"Top 10 Best Things to Do in Berlin Germany - Travel Guide 2025",d:"Berlin's top sights: Brandenburg Gate, Wall, museums - Jul 2025",canal:"Vacation Idea",u:"https://www.youtube.com/watch?v=QBNyYhb6Mq4"},
 mapa:{centro:"Brandenburger Tor Berlin",url:"https://www.google.com/maps/search/?api=1&query=Brandenburg+Gate+Berlin",pois:[
  ["Brandenburg Gate","Brandenburg+Gate+Berlin"],
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
  {cat:"🌅 Good morning",local:"Guten Morgen",pron:"GOO-ten MOR-gen",tip:"Berlin is a night-owl city - don't expect big smiles early!"},
  {cat:"☀️ Good afternoon",local:"Guten Tag",pron:"GOO-ten TAHK",tip:"The most neutral and safe daytime greeting"},
  {cat:"🌙 Good evening",local:"Guten Abend",pron:"GOO-ten AH-bent",tip:"Useful when arriving at hotels or restaurants"},
  {cat:"👋 Hi (Berlin style)",local:"Na? / Hallo",pron:"Nah / HAH-loh",tip:"Na? (How's it going?) is the most Berlin greeting"},
  {cat:"🙏 Please",local:"Bitte",pron:"BIT-uh",tip:"Also used to say 'here you go'"},
  {cat:"😊 Thank you",local:"Danke",pron:"DAHN-kuh",tip:"Quick and effective - Berliners use it constantly"},
  {cat:"🤝 You're welcome",local:"Kein Problem",pron:"Káin Pro-blém",tip:"Literally 'no problem' - very common"},
  {cat:"❓ How much is it?",local:"Was kostet das?",pron:"Vahs KOS-tet dahs?",tip:"Berlin has many flea markets where you'll need this"},
  {cat:"🚽 Where's the restroom?",local:"Wo ist die Toilette?",pron:"Voh ist dee twah-LET-uh?",tip:"En el metro se paga 50 céntimos · ten monedas"},
  {cat:"🍺 Cheers!",local:"Prost! / Zum Wohl!",pron:"Prohst / Tsoom Vohl",tip:"Berlin has Europe's best bar scene - use this often!"}
 ]}
},
{id:"var",wlat:52.2297,wlon:21.0122,name:"Warsaw",flag:"🇵🇱",country:"Poland",days:"Days 5-6",dates:"Thu Sep 10 – Fri Sep 11",moneda:"Polish Złoty (zł / PLN)",cambio:`$1 USD = ${(1/PLN).toFixed(2)} zł`,libre:[],tourPersonal:"",
 atractivos_itinerario:[
  ["Old Town (Stare Miasto)","UNESCO Heritage · rebuilt stone by stone after WWII"],
  ["Royal Castle (Zamek Królewski)","official residence of the Polish kings"],
  ["Sigismund Column","iconic baroque monument facing the castle"],
  ["Church of the Visitationists (Kościół Wizytek)","baroque · where Chopin played the organ as a child"],
 ],
 atractivos_recomendados:[
  ["Warsaw Uprising Museum (1944)","tribute to the Polish resistance · one of Europe's best museums"],
  ["Market Square (Rynek Starego Miasta)","surrounded by colorful 16th-18th century buildings"],
  ["Łazienki Park","palace on the water and Chopin statue · free entry"],
  ["Praga District","Warsaw's alternative bohemian side · galleries and murals"],
 ],
 gastronomia:[
  ["Żurek","sour rye soup with boiled egg and sausage · national dish"],
  ["Bigos","sauerkraut stew with meat and sausage · the most Polish of dishes"],
  ["Pierogi ruskie","potato and cottage cheese dumplings · the most popular"],
  ["Kotlet schabowy","breaded pork cutlet · Polish classic"],
  ["Zapiekanka","baguette with mushrooms and melted cheese · street food"],
 ],
 restaurantes:[
  ["Bar Mleczny (Bares de leche)","casual eateries · dishes from 15-25 zł","~€3-5"],
  ["Zapiekanki en Nowy Świat","classic street food from 10 zł (~€2)","~€2-3"],
  ["Ciudad Vieja (varios)","menus with bigos and pierogi","40+ zł (~€8+)"],
 ],
 video:{t:"Warsaw Travel Guide: 15 Experiences You Can't Forget - 72hr Itinerary",d:"72-hour Warsaw itinerary: Old Town, Royal Castle and hidden gems - Dec 2025",canal:"Travel Channel",u:"https://www.youtube.com/watch?v=axSKpiV-RNI"},
 mapa:{centro:"Plac Zamkowy Warsaw",url:"https://www.google.com/maps/search/?api=1&query=Castle+Square+Warsaw",pois:[
  ["Royal Castle (Zamek Królewski)","Royal+Castle+Warsaw"],
  ["Sigismund Column","Sigismund+Column+Warsaw"],
  ["Old Town Market Square","Old+Town+Market+Place+Warsaw"],
  ["Church of the Visitationists","Church+of+the+Visitationists+Warsaw"],
  ["Parque Lazienki","Lazienki+Park+Warsaw"],
  ["Wilanów Palace","Wilanow+Palace+Warsaw"],
  ["Museo POLIN","POLIN+Museum+Warsaw"],
  ["Palace of Culture","Palace+of+Culture+Warsaw"]
 ]},
 saludos:{idioma:"Polish (Polski)",nota:"Polish has sounds unfamiliar to English speakers — any attempt at Polish creates enormous goodwill with locals!",frases:[
  {cat:"🌅 Good morning",local:"Dzień dobry",pron:"Jen DOH-bry",tip:"Works all day - the safest and most respected greeting"},
  {cat:"🌙 Good evening",local:"Dobry wieczór",pron:"DOH-bry VYEH-choor",tip:"When arriving somewhere at night"},
  {cat:"👋 Hi (informal)",local:"Cześć",pron:"Cheshch",tip:"Only with people your age or younger · very friendly"},
  {cat:"🙏 Please",local:"Proszę",pron:"PROH-sheh",tip:"Also means 'here you go' and 'you're welcome'"},
  {cat:"😊 Thank you",local:"Dziękuję",pron:"Jen-KOO-yeh",tip:"Versión rápida: Dzięki (Yen-ki)"},
  {cat:"🤝 You're welcome",local:"Proszę / Nie ma za co",pron:"PROH-sheh / Nyeh-mah-ZAH-tsoh",tip:"Proszę is the most common response"},
  {cat:"❓ How much is it?",local:"Ile to kosztuje?",pron:"EE-leh toh kosh-TOO-yeh?",tip:"Very useful at the Old Town Market"},
  {cat:"🚽 Where's the restroom?",local:"Gdzie jest toaleta?",pron:"Gjeh yest toh-ah-LEH-tah?",tip:"Toaleta on signs · sometimes 1-2 zł to use"},
  {cat:"🍺 Cheers!",local:"Na zdrowie!",pron:"Nah ZDROH-vyeh",tip:"The Polish toast - beer (piwo) is excellent and affordable"},
  {cat:"😋 Bon appétit!",local:"Smacznego!",pron:"smahch-NEH-goh",tip:"Say it when sitting to eat · Poles really appreciate it"}
 ]}
},
{id:"cra",wlat:50.0647,wlon:19.945,name:"Kraków",flag:"🇵🇱",country:"Poland",days:"Days 6-8",dates:"Fri Sep 11 – Sun Sep 13",moneda:"Polish Złoty (zł / PLN)",cambio:`$1 USD = ${(1/PLN).toFixed(2)} zł`,
 libre:["🟢 Day 7 - Fri Sep 12 (FREE DAY): Auschwitz-Birkenau (Package 1) · Wieliczka Salt Mine (Package 2) · or personal tour in Kraków."],
 tourPersonal:"⭐ Day 7 (Fri Sep 12): If you skip optional tours, explore the Kazimierz Quarter (historic Jewish quarter full of unique cafés), the Main Market Square at your own pace, and Wawel Castle with no rush.",
 atractivos_itinerario:[
  ["📅 DAY 6 - Thu Sep 11","Breakfast · arrival from Warsaw · panoramic tour"],
  ["Wawel Castle","11th-century royal fortress · Poland's ultimate symbol"],
  ["Wawel Cathedral (Basilica of St. Stanislaus and St. Wenceslaus)","royal pantheon · chapels from different eras and architectural styles"],
  ["Corte Renacentista (Sukiennice)","14th-century cloth hall · now a museum and souvenir shops"],
  ["Main Market Square (Rynek Główny)","one of Europe's largest medieval squares"],
  ["Basílica de Santa María (Kościół Mariacki)","Gothic with a 15th-century Veit Stoss carved altar"],
  ["St. Adalbert's Church","small 10th-century pre-Romanesque church"],
  ["📅 DAY 7 - Fri Sep 12 🟢 FREE DAY","Optional excursions or personal tour in Kraków"],
  ["Auschwitz-Birkenau Concentration Camp (Package 1)","The largest Nazi complex · deeply moving visit · monument to Holocaust victims"],
  ["Wieliczka Salt Mine (Package 2)","World's oldest operating salt mine · salt-rock chapels · St. Kinga's Chapel · UNESCO"],
  ["📅 DAY 8 - Sat Sep 13","Breakfast · departure to Prague"],
 ],
 atractivos_recomendados:[
  ["Kazimierz Quarter","historic Jewish quarter · bohemian, full of galleries and unique cafés"],
  ["Complete Old Town (UNESCO Heritage)","walk along the medieval walls and the Barbican"],
  ["Kremówka papieska","the cake John Paul II loved · try it on the square"],
 ],
 gastronomia:[
  ["Obwarzanek krakowski","braided bread ring · Kraków culinary icon since 1400"],
  ["Kraków Pierogi","local version with various fillings · the best in Poland"],
  ["Oscypek","smoked sheep cheese typical of the Małopolska region"],
  ["Żurek w chlebie","soup served inside a hollow rye bread loaf"],
  ["Kremówka papieska","cream cake that John Paul II loved as a child"],
 ],
 restaurantes:[
  ["Bares Mleczny (varios)","full dishes 15-30 zł · authentic and affordable","€3-6"],
  ["Obwarzanek stalls (square)","bread ring from 2-3 zł each","€0.40"],
  ["Restaurantes Kazimierz","ambiente bohemio · menús 35-50 zł","€7-10"],
  ["Starka Restauracja","traditional Polish cuisine · highly rated","€10-18"],
 ],
 video:{t:"20 Things You Need to Know Before Visiting Krakow in 2026",d:"Essential Krakow tips: food, Auschwitz, Jewish Quarter - Mar 2026",canal:"Before You Go",u:"https://www.youtube.com/watch?v=CUSx7CRFoIo"},
 mapa:{centro:"Rynek Glowny Krakow",url:"https://www.google.com/maps/search/?api=1&query=Main+Market+Square+Krakow",pois:[
  ["Wawel Castle","Wawel+Castle+Krakow"],
  ["Wawel Cathedral","Wawel+Cathedral+Krakow"],
  ["Basílica de Santa María","St+Marys+Basilica+Krakow"],
  ["Main Market Square (Rynek Główny)","Rynek+Glowny+Krakow"],
  ["Cloth Hall (Sukiennice)","Sukiennice+Krakow"],
  ["St. Adalbert's Church","St+Adalbert+Church+Krakow"],
  ["Kazimierz Jewish Quarter","Kazimierz+Krakow"],
  ["Fábrica de Schindler","Schindler+Factory+Krakow"],
  ["Auschwitz-Birkenau","Auschwitz+Birkenau+Memorial"],
  ["Minas de sal Wieliczka","Wieliczka+Salt+Mine"]
 ]},
 saludos:{idioma:"Polish (Polski) · Małopolska accent",nota:"Kraków has the oldest and most melodic Polish accent. Cracovians are warmer than Varsovians — any Polish attempt earns big smiles!",frases:[
  {cat:"🌅 Good morning",local:"Dzień dobry",pron:"Jen DOH-bry",tip:"The star greeting - works any time of day, always correct"},
  {cat:"🌙 Good evening",local:"Dobry wieczór",pron:"DOH-bry VYEH-choor",tip:"When entering a restaurant or bar at night"},
  {cat:"👋 Hi (informal)",local:"Cześć",pron:"Cheshch",tip:"With young people in casual settings · sounds like 'honor' in Latin"},
  {cat:"🙏 Please",local:"Proszę",pron:"PROH-sheh",tip:"Irreplaceable · use it when asking for anything"},
  {cat:"😊 Thank you",local:"Dziękuję bardzo",pron:"Jen-KOO-yeh BAR-dzoh",tip:"Bardzo = very much · for extra gratitude"},
  {cat:"🤝 You're welcome",local:"Nie ma za co",pron:"Nyeh-mah-ZAH-tsoh",tip:"Literally 'don't mention it'"},
  {cat:"❓ How much is it?",local:"Ile to kosztuje?",pron:"EE-leh toh kosh-TOO-yeh?",tip:"Imprescindible en el Mercado Stary Kleparz"},
  {cat:"🚽 Where's the restroom?",local:"Gdzie jest toaleta?",pron:"Gjeh yest toh-ah-LEH-tah?",tip:"There are public restrooms near the Cloth Hall on the Main Market Square"},
  {cat:"🍺 Cheers!",local:"Na zdrowie!",pron:"Nah ZDROH-vyeh",tip:"Kraków has excellent craft beer bars (piwo kraftowe)"},
  {cat:"😋 Bon appétit!",local:"Smacznego!",pron:"smahch-NEH-goh",tip:"Especially useful before trying pierogi · the iconic local dish"}
 ]}
},
{id:"pra",wlat:50.0755,wlon:14.4378,name:"Prague",flag:"🇨🇿",country:"Czech Republic",days:"Days 8-10",dates:"Sun Sep 13 – Mon Sep 15",moneda:"Czech Koruna (Kč / CZK)",cambio:`$1 USD = ${(1/CZK).toFixed(1)} Kč`,
 libre:["🟢 Day 9 - Sun Sep 14 (FREE DAY): Vltava River Cruise (Package 1) · Karlovy Vary or Czech Evening with dinner (Package 2) · or personal tour."],
 tourPersonal:"⭐ Day 9 (Sun Sep 14): No optional tours? Visit Prague Castle on your own (not included in the Day 8 panoramic tour), cross Charles Bridge at sunrise when it's empty, and explore Malá Strana at your leisure.",
 atractivos_itinerario:[
  ["📅 DAY 8 - Sat Sep 13","Breakfast · arrival from Kraków · panoramic tour morning and afternoon"],
  ["Václav Havel Square (Wenceslas Square)","one of Prague's largest squares · central historic boulevard"],
  ["Old Town Square","between Václav Havel Square and Charles Bridge (Karlův Most)"],
  ["Astronomical Clock Tower","campanas cada hora · construido en 1410"],
  ["Týn Church","14th-century Gothic · iconic on the Old Town Square"],
  ["Town Hall Viejo","home of the famous astronomical clock"],
  ["St. Nicholas Church","mentioned in the itinerary · 18th-century baroque"],
  ["Monumento a Jan Hus","on the Old Town Square · 15th-century Czech reformer"],
  ["Charles Bridge (Karlův Most)","built in the 14th century · 30 baroque statues"],
  ["📅 DAY 9 - Sun Sep 14 🟢 FREE DAY","Optional excursions or personal tour in Prague"],
  ["Boat ride on the Vltava River (Package 1)","Boat tour · passes under Charles Bridge · views of Prague Castle"],
  ["Karlovy Vary Excursion (Package 2)","Elegant spa town · 12 thermal springs · frequented by royalty and celebrities"],
  ["Czech evening with traditional dinner (Package 2)","Traditional Czech dinner · folk music · typical dances · local wine or beer"],
  ["📅 DAY 10 - Mon Sep 15","Breakfast · departure to Nuremberg"],
 ],
 atractivos_recomendados:[
  ["Prague Castle","the largest in the world by area · dominates the city from the hill"],
  ["Jewish Quarter (Josefov)","6 historic synagogues and a 12th-century cemetery"],
  ["Malá Strana District","baroque houses at the foot of the castle · very photogenic"],
  ["Museo Kafka","tribute to the writer born in Prague in 1883"],
 ],
 gastronomia:[
  ["Svíčková na smetaně","beef sirloin in cream sauce with knedlíky (dumplings)"],
  ["Vepřo-knedlo-zelo","roast pork with sauerkraut and knedlíky · Czech national dish"],
  ["Trdelník","dough roasted on a spit with sugar and cinnamon · street food"],
  ["Guláš checo","similar to the Hungarian · with bread or dumplings"],
  ["Smažený sýr","breaded fried cheese · a Czech favorite"],
  ["Svařák","mulled spiced wine · perfect in September"],
 ],
 restaurantes:[
  ["Lokál (varios locales)","authentic Czech cuisine · fresh Pilsner Urquell","~€8-15"],
  ["Malá Strana (zona)","menus with goulash and svíčková from 200 Kč","~€8-12"],
  ["Trdelník stalls (square)","80-100 Kč each","~€3-4"],
  ["Havelské tržiště","historic market · fruit and snacks","€2-6"],
 ],
 video:{t:"Prague Travel Guide 2025 - Must-See Spots Walking Tour",d:"Full walking tour through Prague's magical streets - Aug 2025",canal:"Travel Guide",u:"https://www.youtube.com/watch?v=BOyinB6qB9E"},
 mapa:{centro:"Old Town Square Prague",url:"https://www.google.com/maps/search/?api=1&query=Old+Town+Square+Prague",pois:[
  ["Václav Havel Square","Wenceslas+Square+Prague"],
  ["Old Town Square","Old+Town+Square+Prague"],
  ["Astronomical Clock","Prague+Astronomical+Clock"],
  ["Týn Church","Tyn+Church+Prague"],
  ["Town Hall Viejo","Old+Town+Hall+Prague"],
  ["St. Nicholas Church","St+Nicholas+Church+Prague"],
  ["Monumento a Jan Hus","Jan+Hus+Memorial+Prague"],
  ["Charles Bridge","Charles+Bridge+Prague"],
  ["Prague Castle","Prague+Castle"],
  ["St. Vitus Cathedral","St+Vitus+Cathedral+Prague"],
  ["Muro de John Lennon","Lennon+Wall+Prague"]
 ]},
 saludos:{idioma:"Czech (Čeština)",nota:"Czech is a Slavic language with stress on the first syllable. Czechs may seem reserved at first — trying their language changes everything!",frases:[
  {cat:"🌅 Good morning",local:"Dobré ráno",pron:"DOH-breh RAH-noh",tip:"Only until about 10 am"},
  {cat:"☀️ Good afternoon",local:"Dobré odpoledne",pron:"DOH-breh OD-poh-led-neh",tip:"From noon · somewhat formal"},
  {cat:"🌙 Good evening",local:"Dobrou noc",pron:"DOH-broh nots",tip:"When saying goodbye at night"},
  {cat:"👋 Hello (anytime)",local:"Dobrý den",pron:"DOH-bree den",tip:"The most versatile · all-day formal greeting"},
  {cat:"👋 Hi (informal)",local:"Ahoj",pron:"AH-hoy",tip:"Informal y amistoso · igual al español 'ahoy'"},
  {cat:"🙏 Please",local:"Prosím",pron:"PROH-seem",tip:"Also 'here you go' and a reply to 'thank you'"},
  {cat:"😊 Thank you",local:"Děkuji",pron:"DJEH-koo-yee",tip:"Informal: Díky (DEE-kee) - very common"},
  {cat:"🤝 You're welcome",local:"Prosím / Není zač",pron:"Pro-sím / Né-ní zach",tip:"Prosím is the most common response"},
  {cat:"❓ How much is it?",local:"Kolik to stojí?",pron:"KOH-lik toh STOH-yee?",tip:"Essential · Prague has many markets and souvenirs"},
  {cat:"🚽 Where's the restroom?",local:"Kde je toaleta?",pron:"Gdeh yeh toh-ah-LEH-tah?",tip:"WC on signs · costs 10-20 Kč in many places"},
  {cat:"🍺 Cheers!",local:"Na zdraví!",pron:"Nah ZDRAH-vee",tip:"Essential! Prague has the world's best beer · make eye contact when toasting"}
 ]}
},
{id:"nur",wlat:49.4521,wlon:11.0767,name:"Nuremberg",flag:"🇩🇪",country:"Germany",days:"Days 10-12",dates:"Mon Sep 15 – Wed Sep 17",moneda:"Euro (€)",cambio:`1 € = $${EUR.toFixed(3)} USD`,
 libre:["🟢 Day 11 - Tue Sep 16 (FREE DAY): Rothenburg ob der Tauber (Package 1) · Munich (Package 2) · or personal tour."],
 tourPersonal:"⭐ Day 11 (Tue Sep 16): No optional tours? Nuremberg offers the Nuremberg Trials Courthouse (Courtroom 600 where Nazi crimes were tried), the walkable medieval walls and the Imperial Castle, all within walking distance of the hotel.",
 atractivos_itinerario:[
  ["📅 DAY 10 - Mon Sep 15","Breakfast · arrival from Prague · city tour"],
  ["Nuremberg Imperial Castle (Kaiserburg)","built atop a hill about a thousand years ago · the living core of the city"],
  ["Church of Our Lady (Frauenkirche)","Gothic on the Hauptmarkt · clock with mechanical figures"],
  ["Casa de la Ópera (Opernhaus)","Nuremberg opera house · mentioned in the tour itinerary"],
  ["Old Town Hall (Altes Rathaus)","with visitable medieval dungeons"],
  ["Río Pegnitz","fascinating views of the river crossing the medieval center"],
  ["📅 DAY 11 - Tue Sep 16 🟢 FREE DAY","Optional excursions or personal tour in Nuremberg"],
  ["Rothenburg ob der Tauber (Package 1)","Germany's best-preserved medieval town · walls · half-timbered houses · Romantic Road"],
  ["Munich City (Package 2)","Capital de Baviera · Oktoberfest · Marienplatz · Nuevo Town Hall · cultura cervecera"],
  ["📅 DAY 12 - Wed Sep 17","Breakfast · departure to Frankfurt"],
 ],
 atractivos_recomendados:[
  ["Walled Old Town","nearly intact 5 km medieval walls · fully walkable"],
  ["Nuremberg Trials (Courtroom 600)","where Nazi crimes were tried in 1945-46 · open to visitors"],
  ["Hauptmarkt","central square · famous for the Christkindlesmarkt Christmas market"],
  ["Germanic National Museum","the world's largest German-speaking art and culture museum"],
 ],
 gastronomia:[
  ["Nürnberger Bratwürste","Germany's most famous sausages · tiny and grilled"],
  ["Schäufele","roasted pork shoulder with sauerkraut and potato dumpling"],
  ["Lebkuchen","spiced gingerbread · the most famous in Europe"],
  ["Elisen-Lebkuchen","premium lebkuchen · Nuremberg PGI"],
 ],
 restaurantes:[
  ["Bratwurst Röslein (Hauptmarkt)","traditional bratwürste on the central square","€8-14"],
  ["Heilig-Geist-Spital","historic riverside restaurant","€12-20"],
  ["Puestos Hauptmarkt","sausages and lebkuchen on the street","€3-6"],
 ],
 video:{t:"Ultimate Nuremberg Germany Travel Guide - Best Things to See & Do",d:"Germany's most magical fairytale city? Full narrated guide - Oct 2025",canal:"Travel Guide",u:"https://www.youtube.com/watch?v=0O2Eg7cW_Wo"},
 mapa:{centro:"Hauptmarkt Nuremberg",url:"https://www.google.com/maps/search/?api=1&query=Hauptmarkt+Nuremberg",pois:[
  ["Imperial Castle","Nuremberg+Castle"],
  ["Church of Our Lady (Frauenkirche)","Frauenkirche+Nuremberg"],
  ["Casa de la Ópera","Nuremberg+Opera+House"],
  ["Town Hall Viejo","Old+Town+Hall+Nuremberg"],
  ["Río Pegnitz","Pegnitz+River+Nuremberg"],
  ["Plaza Hauptmarkt","Hauptmarkt+Nuremberg"],
  ["St. Lawrence Church","St+Lorenz+Church+Nuremberg"],
  ["Casa de Albrecht Dürer","Albrecht+Durer+House+Nuremberg"],
  ["Rothenburg ob der Tauber","Rothenburg+ob+der+Tauber"]
 ]},
 saludos:{idioma:"German (Deutsch) · Franconian-Bavarian dialect",nota:"Nuremberg is in Franconia, a region with its own dialect. Standard German works perfectly — but local expressions earn warm smiles.",frases:[
  {cat:"🌅 Good morning",local:"Guten Morgen",pron:"GOO-ten MOR-gen",tip:"Standard German - always correct"},
  {cat:"☀️ Good afternoon",local:"Guten Tag",pron:"GOO-ten TAHK",tip:"The most neutral daytime greeting"},
  {cat:"🌙 Good evening",local:"Guten Abend",pron:"GOO-ten AH-bent",tip:"After 6 pm · when entering restaurants"},
  {cat:"👋 Hola (franco)",local:"Grüß Gott",pron:"Grooss Gott",tip:"Traditional Bavarian-Franconian greeting · literally 'God greet you'"},
  {cat:"👋 Hi (informal)",local:"Servus",pron:"ZAIR-voos",tip:"Typical southern Germany - warm and friendly"},
  {cat:"🙏 Please",local:"Bitte",pron:"BIT-uh",tip:"Universal throughout Germany"},
  {cat:"😊 Thank you",local:"Danke schön",pron:"DAHN-kuh shurn",tip:"En dialecto local: Vergelt's Gott (vergelt-s-got)"},
  {cat:"🤝 You're welcome",local:"Gern geschehen",pron:"Gern je-shé-en",tip:"With pleasure - warmer than just Bitte"},
  {cat:"❓ How much is it?",local:"Was kostet das?",pron:"Vahs KOS-tet dahs?",tip:"For the Castle market and the Old Town"},
  {cat:"🚽 Where's the restroom?",local:"Wo ist die Toilette?",pron:"Voh ist dee twah-LET-uh?",tip:"Look for WC on signs medievales"},
  {cat:"🍺 Cheers!",local:"Prost!",pron:"Prohst",tip:"With a Nürnberger Bratwurst and Franconian beer · the full experience"}
 ]}
},
{id:"fra",wlat:50.1109,wlon:8.6821,name:"Frankfurt",flag:"🇩🇪",country:"Germany",days:"Days 12-13",dates:"Wed Sep 17 – Thu Sep 18",moneda:"Euro (€)",cambio:`1 € = $${EUR.toFixed(3)} USD`,libre:[],tourPersonal:"",
 atractivos_itinerario:[
  ["📅 DAY 12 - Wed Sep 17","Breakfast · arrival from Nuremberg · Frankfurt city visit"],
  ["Römer family buildings (13th-14th c.)","Frankfurt's most photogenic historic town hall"],
  ["St. Nicholas Church","next to the Römerberg · mentioned in the itinerary"],
  ["Imperial Cathedral of St. Bartholomew","coronation site of the Holy Roman emperors"],
  ["Banco Central Europeo (BCE)","majestic skyline mentioned in the itinerary"],
  ["Banco de Alemania (Deutsche Bundesbank)","one of the world's most important financial institutions"],
  ["Bolsa de Frankfurt (Börse)","famous bull and bear statues outside"],
  ["Evening boat ride on the Main River (Package 2)","Evening boat tour · contrast between the historic Römer and the financial skyline"],
  ["📅 DAY 13 - Thu Sep 18","Breakfast · departure to Luxembourg and Metz"],
 ],
 atractivos_recomendados:[
  ["Römerberg (historic square)","Frankfurt's medieval tourist heart · very photogenic"],
  ["Museumsufer","Main riverbank with 12 museums in a row · the Städel Art Museum is a must"],
  ["Kleinmarkthalle","19th-century covered market with unique regional products"],
  ["Skyline financiero","Germany's most unique skyline · skyscrapers beside the medieval old town"],
 ],
 gastronomia:[
  ["Grüne Soße","cold sauce of 7 local herbs · Frankfurt's signature dish"],
  ["Handkäse mit Musik","strong cheese with pickled onion and cumin"],
  ["Frankfurter Würstchen","the original frankfurter sausage · with mustard and bread"],
  ["Äppelwoi","sidra de manzana ácida local · la bebida de Frankfurt"],
  ["Rippchen mit Kraut","cured pork ribs with sauerkraut"],
 ],
 restaurantes:[
  ["Kleinmarkthalle (Hasengasse 5-7)","gourmet market · cheeses, cured meats, tapas","€3-8"],
  ["Sachsenhausen (cider house district)","Äppelwoi y Handkäse · ambiente local auténtico","€3-10"],
  ["Zum Gemalten Haus","classic cider house with homemade Grüne Soße","€10-18"],
 ],
 video:{t:"Best Things to Do in Frankfurt Germany - First Timers Guide",d:"Frankfurt travel guide with all the best sights - Feb 2026",canal:"Travel Vlog",u:"https://www.youtube.com/watch?v=sBv7Zdp1NEg"},
 mapa:{centro:"Römerberg Frankfurt",url:"https://www.google.com/maps/search/?api=1&query=Romerberg+Frankfurt",pois:[
  ["Römerberg (Römer Square)","Romerberg+Frankfurt"],
  ["St. Nicholas Church","St+Nicholas+Church+Frankfurt"],
  ["Imperial Cathedral (Dom)","Frankfurt+Cathedral"],
  ["Banco Central Europeo","European+Central+Bank+Frankfurt"],
  ["Bolsa de Frankfurt","Frankfurt+Stock+Exchange"],
  ["Río Meno","Main+River+Frankfurt"],
  ["Main Tower","Main+Tower+Frankfurt"],
  ["Museo Städel","Stadel+Museum+Frankfurt"],
  ["Casa de Goethe","Goethe+House+Frankfurt"],
  ["Barrio Sachsenhausen","Sachsenhausen+Frankfurt"]
 ]},
 saludos:{idioma:"German (Deutsch) · Hessian dialect",nota:"Frankfurt is Germany's most cosmopolitan city — English is widely spoken especially in finance. The local dialect is Hessisch but standard German is perfect.",frases:[
  {cat:"🌅 Good morning",local:"Guten Morgen",pron:"GOO-ten MOR-gen",tip:"Frankfurt is an early-rising financial city"},
  {cat:"☀️ Good afternoon",local:"Guten Tag",pron:"GOO-ten TAHK",tip:"Safe and formal throughout the day"},
  {cat:"🌙 Good evening",local:"Guten Abend",pron:"GOO-ten AH-bent",tip:"When arriving in Sachsenhausen for dinner"},
  {cat:"👋 Hi (Hessian local)",local:"Guude!",pron:"GOO-duh",tip:"Frankfurt's signature greeting - very local and appreciated"},
  {cat:"👋 Hi (informal)",local:"Hallo / Hey",pron:"Já-lo / Jey",tip:"In Sachsenhausen bars and younger areas"},
  {cat:"🙏 Please",local:"Bitte",pron:"BIT-uh",tip:"Múltiple uso: pedir, agradecer y dar"},
  {cat:"😊 Thank you",local:"Danke",pron:"DAHN-kuh",tip:"Rápido y efectivo · en el dialecto local: Merci (francés adoptado)"},
  {cat:"🤝 You're welcome",local:"Bitte sehr",pron:"BIT-uh zayr",tip:"With pleasure - polite and correct"},
  {cat:"❓ How much is it?",local:"Was kostet das?",pron:"Vahs KOS-tet dahs?",tip:"Useful at the Römer market and Zeil shops"},
  {cat:"🚽 Where's the restroom?",local:"Wo ist die Toilette?",pron:"Voh ist dee twah-LET-uh?",tip:"The airport restrooms are the best in Europe"},
  {cat:"🍺 Cheers!",local:"Prost! / Ebbelwei!",pron:"Prost / É-bel-vai",tip:"Ebbelwei is Frankfurt's apple cider · toast with it in Sachsenhausen"}
 ]}
},
{id:"lux",wlat:49.6116,wlon:6.1319,name:"Luxembourg",flag:"🇱🇺",country:"Grand Duchy of Luxembourg",days:"Day 13 (excursion) & 14",dates:"Thu Sep 18 – Fri Sep 19",moneda:"Euro (€)",cambio:`1 € = $${EUR.toFixed(3)} USD`,
 libre:["Day 14 - Fri Sep 19: Luxembourg is an optional Package 1 excursion from Metz (34 mi · 45 min by train)."],
 tourPersonal:"⭐ Day 14 (Fri Sep 19): Si no contratas el tour a Luxemburgo, you can go independently from Metz by train (€10-15 ida y vuelta). La Luxembourg City es visitable en un día completo camin agoando.",
 atractivos_itinerario:[
  ["Luxembourg City (excursión opcional Paquete 1)","UNESCO Heritage · included in the optional tour"],
  ["Schengen City (Package 2)","Where the Schengen Agreement (1985) was signed, abolishing border controls in Europe"],
 ],
 atractivos_recomendados:[
  ["Old Town and Pétrusse valleys","city over deep valleys · unique views"],
  ["Bock Casemates","17th-century defensive tunnels open to the public"],
  ["Grand Ducal Palace","official residence of the Grand Duke · in the historic center"],
  ["Puente Adolphe","art nouveau over the valley · spectacular views"],
  ["Place d'Armes","lively central square with terraces"],
 ],
 gastronomia:[
  ["Judd mat Gaardebounen","smoked pork with broad beans · Luxembourg's national dish"],
  ["Gromperekichelcher","street potato fritters · the most popular"],
  ["Quetschentaart","plum tart · traditional Luxembourg dessert"],
  ["Vino Mosela luxemburgués","dry whites produced along the Moselle River"],
 ],
 restaurantes:[
  ["Place d'Armes (brasseries)","daily menus on the central square","€12-20"],
  ["Grund (lower town)","restaurants along the Alzette river · more affordable","€10-15"],
  ["Covered market (Knuedler)","cheeses, cured meats and local products","€5-10"],
 ],
 video:{t:"Luxembourg: Europe's Richest Country! Top 10 Things To Do",d:"Old Town, Bock Casemates, Corniche and more - Feb 2026",canal:"Travel Guide",u:"https://www.youtube.com/watch?v=1jsQXl3i82M"},
 mapa:{centro:"Place Guillaume II Luxembourg",url:"https://www.google.com/maps/search/?api=1&query=Place+Guillaume+II+Luxembourg+City",pois:[
  ["Place Guillaume II","Place+Guillaume+II+Luxembourg"],
  ["Bock Casemates","Bock+Casemates+Luxembourg"],
  ["Grand Ducal Palace","Grand+Ducal+Palace+Luxembourg"],
  ["Catedral Notre-Dame","Notre+Dame+Cathedral+Luxembourg"],
  ["Puente Adolphe","Adolphe+Bridge+Luxembourg"],
  ["Chemin ago de la Corniche","Chemin ago+de+la+Corniche+Luxembourg"],
  ["Casco Antiguo","Luxembourg+Old+Quarter"],
  ["Schengen","Schengen+Luxembourg"]
 ]},
 saludos:{idioma:"Luxembourgish (Lëtzebuergesch) · French · German",nota:"Luxembourg has 3 official languages: Luxembourgish, French and German. Everyone speaks all three. French is most practical — but a Luxembourgish greeting is truly special!",frases:[
  {cat:"🌅 Good morning (Lux.)",local:"Gudde Moien",pron:"GOO-duh MOY-en",tip:"The most special greeting you can give - watch faces light up!"},
  {cat:"☀️ Good day (French)",local:"Bonjour",pron:"Bohn-ZHOOR",tip:"Safe and universal throughout the city"},
  {cat:"🌙 Good evening (French)",local:"Bonsoir",pron:"Bohn-SWAHR",tip:"After 6 pm"},
  {cat:"👋 Hi (Luxembourgish)",local:"Moien",pron:"MOY-en",tip:"Very casual · locals use it among themselves all day"},
  {cat:"🙏 Please (French)",local:"S'il vous plaît",pron:"Seel-voo-PLAY",tip:"Essential at shops and cafés"},
  {cat:"😊 Thank you",local:"Merci",pron:"Mair-SEE",tip:"They use French Merci - same in all 3 languages"},
  {cat:"🤝 You're welcome (French)",local:"De rien / Je vous en prie",pron:"De ryen / Ye vuz on prí",tip:"De rien en casual · Je vous en prie en formal"},
  {cat:"❓ ¿Cuánto cuesta? (fr.)",local:"Combien ça coûte?",pron:"Kohm-BYAN sah KOOT?",tip:"At the Guillaume market or old town shops"},
  {cat:"🚽 Restroom? (French)",local:"Où sont les toilettes?",pron:"Ú son le twá-let?",tip:"Ask confidently at any café"},
  {cat:"🍺 Cheers!",local:"Prost! / Santé!",pron:"Prohst / Sahn-TAY",tip:"German Prost and French Santé · both are correct"}
 ]}
},
{id:"met",wlat:49.1193,wlon:6.1757,name:"Metz",flag:"🇫🇷",country:"France (Lorraine)",days:"Days 13-15 (base city)",dates:"Thu Sep 18 – Sat Sep 20",moneda:"Euro (€)",cambio:`1 € = $${EUR.toFixed(3)} USD`,
 libre:["🟢 Day 14 - Fri Sep 19 (FREE DAY): Strasbourg/Colmar (Pkg.1) · Luxembourg (Pkg.1) · Schengen (Pkg.2) · or Metz on your own."],
 tourPersonal:"⭐ Day 14 (Fri Sep 19): If you skip the Luxembourg tour, you can go independently from Metz by train (€10-15 round trip). Luxembourg City is fully walkable in one day. Metz itself offers Saint-Étienne Cathedral (the largest medieval stained glass in the world), the Centre Pompidou-Metz and the Temple Quarter, all walkable in a very pleasant day.",
 atractivos_itinerario:[
  ["📅 DAY 13 - Thu Sep 18","Breakfast · arrival from Frankfurt · free time for optional excursions"],
  ["Luxembourg City (Package 1)","Capital of the Grand Duchy · UNESCO Casemates · one of Europe's financial and political centers"],
  ["Schengen City (Package 2)","Where the Schengen Agreement (1985) was signed, abolishing border controls in Europe"],
  ["Metz / Thionville as base city","accommodation during days 13-15"],
  ["📅 DAY 14 - Fri Sep 19 🟢 FREE DAY","Excursiones opcionales o exploración libre de Metz"],
  ["Strasbourg (Package 1)","Gothic cathedral · seat of the European Parliament · excursion together with Colmar (Package 1)"],
  ["Colmar (Package 1)","Fairytale architecture · 'Little Venice' quarter · excursion together with Strasbourg (Package 1)"],
  ["📅 DAY 15 - Sat Sep 20","Breakfast · departure to Brussels"],
 ],
 atractivos_recomendados:[
  ["Metz Cathedral (Saint-Étienne)","Gothic with the largest medieval stained glass in the world · stunning"],
  ["Centre Pompidou-Metz","satellite of the Paris modern art museum · spectacular architecture"],
  ["Temple Quarter","medieval with small canals and charming squares"],
  ["Place de la République","lively central square with terraces and a market"],
  ["Saulcy Island","university campus on a Moselle island · pleasant walk"],
 ],
 gastronomia:[
  ["Quiche Lorraine","bacon and cream tart · originally from exactly this region"],
  ["Mirabelles de Lorena","ciruelas amarillas locales · septiembre es su temporada perfecta"],
  ["Pâté Lorrain","hojaldre relleno de carne marinada · especialidad regional única"],
  ["Vino de Mosela","whites and reds from the Lorraine region"],
 ],
 restaurantes:[
  ["Marchés couverts de Metz","quiches, cured meats and local products","€5-10"],
  ["Downtown Winstubs","Alsatian bistros · quiche and wine","€10-16"],
  ["Place Saint-Jacques (zona)","central square · varied daily menus","€10-16"],
 ],
 video:{t:"One Day In Metz France - Top Things to Do & See Walking Tour",d:"Walking tour: cathedral, Pompidou, Porte des Allemands - Aug 2025",canal:"Travel Guide",u:"https://www.youtube.com/watch?v=ahY6ipxtJN8"},
 mapa:{centro:"Place dArmes Metz",url:"https://www.google.com/maps/search/?api=1&query=Place+darmes+Metz+France",pois:[
  ["Saint-Étienne Cathedral","Saint+Etienne+Cathedral+Metz"],
  ["Place d'Armes","Place+darmes+Metz"],
  ["Place Saint-Louis","Place+Saint+Louis+Metz"],
  ["Centre Pompidou-Metz","Centre+Pompidou+Metz"],
  ["Puerta Imperial Alemana","Porte+des+Allemands+Metz"],
  ["Jardín de la Esplanada","Esplanade+Metz"],
  ["Río Mosela","Moselle+River+Metz"],
  ["Strasbourg","Strasbourg+France"],
  ["Colmar","Colmar+France"]
 ]},
 saludos:{idioma:"French (Français) · Lorraine",nota:"Metz is in the Lorraine region, bordering Germany and Luxembourg. French is the daily language — Lorrainers really appreciate the effort to speak it!",frases:[
  {cat:"🌅 Good morning",local:"Bonjour",pron:"Bohn-ZHOOR",tip:"The most important French greeting - always say this first"},
  {cat:"🌙 Good evening",local:"Bonsoir",pron:"Bohn-SWAHR",tip:"After 6 pm · en restaurantes y tiendas"},
  {cat:"👋 Hi (informal)",local:"Salut",pron:"Sah-LOO",tip:"Only with people you know or young people · never with strangers"},
  {cat:"🙏 Please",local:"S'il vous plaît",pron:"Seel-voo-PLAY",tip:"Obligatorio antes de pedir cualquier cosa · sin esto pueden ignorarte"},
  {cat:"😊 Thank you",local:"Merci beaucoup",pron:"Mair-SEE boh-KOO",tip:"Beaucoup = a lot · just Merci is also perfect"},
  {cat:"🤝 You're welcome",local:"De rien / Avec plaisir",pron:"Duh ree-EN / Ah-vek pleh-ZEER",tip:"Avec plaisir is warmer · 'with pleasure'"},
  {cat:"❓ How much is it?",local:"Combien ça coûte?",pron:"Kohm-BYAN sah KOOT?",tip:"At the Place de la Cathédrale market or local shops"},
  {cat:"🚽 Where's the restroom?",local:"Où sont les toilettes?",pron:"Ú son le twá-let?",tip:"French don't say 'salle de bain' for public restrooms"},
  {cat:"🍺 Cheers!",local:"Santé!",pron:"Sahn-TAY",tip:"Make eye contact · not doing so is bad luck per French tradition"},
  {cat:"😋 Bon appétit!",local:"Bon appétit!",pron:"Bohn ah-pay-TEE",tip:"Say it when sitting down · the French say it before every meal"}
 ]}
},
{id:"bru",wlat:50.8503,wlon:4.3517,name:"Brussels",flag:"🇧🇪",country:"Belgium",days:"Days 15-17",dates:"Sat Sep 20 – Mon Sep 22",moneda:"Euro (€)",cambio:`1 € = $${EUR.toFixed(3)} USD`,
 libre:["🟢 Day 16 - Sun Sep 21 (FREE DAY): Bruges and Ghent (Package 1) · or Brussels on your own."],
 tourPersonal:"⭐ Day 16 (Sun Sep 21): If you skip the Bruges/Ghent tour, Brussels offers the Atomium, the Royal Museums of Fine Arts (Magritte), the Grand Place, the European Quarter — all walkable.",
 atractivos_itinerario:[
  ["📅 DAY 15 - Sat Sep 20","Breakfast · arrival from Metz · Brussels city tour"],
  ["Grand Place (Main Square)","UNESCO Heritage · considered the most beautiful square in the world"],
  ["Galerías Reales de Saint-Hubert","19th-century neoclassical shopping arcade"],
  ["Manneken Pis","escultura icónica símbolo de Bruselas"],
  ["Royal Palace de Bruselas","official residence of the Belgian king"],
  ["Museos Reales de Bellas Artes","Bruegel, Rubens y Magritte bajo el mismo techo"],
  ["📅 DAY 16 - Sun Sep 21 🟢 FREE DAY","Optional excursions or Brussels on your own"],
  ["Bruges and Ghent (Package 1)","Bruges: 'Venice of the North' · medieval canals · Flemish architecture. Ghent: medieval castle · vibrant city"],
  ["📅 DAY 17 - Mon Sep 22","Breakfast · departure to Amsterdam"],
 ],
 atractivos_recomendados:[
  ["Atomium","estructura de hierro en forma de átomo · Expo 1958 · ícono de Bruselas"],
  ["European Quarter","home of the European Commission and European Parliament"],
  ["Cathedral of St. Michael and St. Gudula","13th-century Gothic · impressive interior"],
  ["Marolles District","working-class area with the Place du Jeu de Balle antique market"],
 ],
 gastronomia:[
  ["Gaufres de Bruselas","rectangular crispy waffle · the authentic one is from the street"],
  ["Moules-frites","steamed mussels with fries · Belgian national dish"],
  ["Carbonade flamande","beef stewed in Belgian beer · deep and savory"],
  ["Chocolate belga","Godiva, Neuhaus, Leonidas · the world's best"],
  ["Cerveza belga","1,500+ variedades: Trappist, Gueuze, Lambic, Dubbel"],
  ["Frites belges","fries in a cone with mayonnaise · the crispiest in Europe"],
 ],
 restaurantes:[
  ["Friterie Antoine (Place Jourdan)","Brussels' most famous fries","€4-6"],
  ["Rue du Marché aux Fromages","street of varied Mediterranean menus","€8-13"],
  ["Mercado de Midi (domin agogos)","Belgium's largest market · cheeses, breads","€3-8"],
  ["Moeder Lambic (St-Gilles)","400+ craft beers with tapas","€5-12"],
 ],
 video:{t:"Brussels Belgium - Full Travel Guide 2025",d:"Grand Place, chocolate, beer, Atomium - May 2025",canal:"Travel Channel",u:"https://www.youtube.com/watch?v=xL4s1imrVKU"},
 mapa:{centro:"Grand Place Brussels",url:"https://www.google.com/maps/search/?api=1&query=Grand+Place+Brussels",pois:[
  ["Grand Place (Main Square)","Grand+Place+Brussels"],
  ["Galerías Saint-Hubert","Galeries+Saint+Hubert+Brussels"],
  ["Manneken Pis","Manneken+Pis+Brussels"],
  ["Royal Palace","Royal+Palace+Brussels"],
  ["Museos Reales de Bellas Artes","Royal+Museums+of+Fine+Arts+Brussels"],
  ["Atomium","Atomium+Brussels"],
  ["Museo Magritte","Magritte+Museum+Brussels"],
  ["Mont des Arts","Mont+des+Arts+Brussels"],
  ["Mini-Europe","Mini+Europe+Brussels"],
  ["Bruges","Bruges+Belgium"],
  ["Ghent","Ghent+Belgium"]
 ]},
 saludos:{idioma:"French (Français) · Dutch (Nederlands)",nota:"Brussels is officially bilingual — French is more commonly used. Belgians are famous for being kind and tolerant with foreigners who try their language.",frases:[
  {cat:"🌅 Good day (French)",local:"Bonjour",pron:"Bohn-ZHOOR",tip:"The greeting that opens all doors in Brussels"},
  {cat:"🌙 Good evening (French)",local:"Bonsoir",pron:"Bohn-SWAHR",tip:"When arriving at restaurants or bars at night"},
  {cat:"👋 Hi (Belgian)",local:"Dag / Bonjour",pron:"Dahkh / Bohn-ZHOOR",tip:"Dag is the Dutch greeting · also widely used in Brussels"},
  {cat:"🙏 Please (French)",local:"S'il vous plaît",pron:"Seel-voo-PLAY",tip:"Essential before asking anything · Belgians are very formal"},
  {cat:"😊 Thank you (French)",local:"Merci",pron:"Mair-SEE",tip:"Brussels also accepts Dutch Dank u (DAHNK oo)"},
  {cat:"😊 Thank you (Dutch)",local:"Dank u wel",pron:"DAHNK oo vel",tip:"Usar esto en Bruselas sorprende y agrada mucho"},
  {cat:"🤝 You're welcome",local:"De rien / Graag gedaan",pron:"De ryen / Jráj je-dán",tip:"French or Dutch depending on the language you spoke"},
  {cat:"❓ ¿Cuánto cuesta? (fr.)",local:"Combien ça coûte?",pron:"Kohm-BYAN sah KOOT?",tip:"For the Grand Place market and Belgian chocolate"},
  {cat:"🚽 Where's the restroom? (French)",local:"Où sont les toilettes?",pron:"Ú son le twá-let?",tip:"Many Belgian bars have restrooms for customers only"},
  {cat:"🍺 Cheers!",local:"Santé! / Proost!",pron:"San-té / Próost",tip:"Belgium has over 1,500 beers · it deserves a special toast"},
  {cat:"🍫 This is delicious!",local:"C'est délicieux!",pron:"Say day-lee-SYUH",tip:"Dilo al probar el chocolate belga · es la verdad absoluta"}
 ]}
},
];

const tours=[
 {id:"pot",wlat:52.3906,wlon:13.0645,name:"Potsdam",flag:"🇩🇪",
  precio:"$90 USD",base:"From Berlin · 22 mi · 35 min",
  desc:"Potsdam has a royal feel with the palaces of the Prussian kings and their parks. The post-WWII Peace Conference was held here. During our tour we visit the City Palace, St. Nicholas Church, the Brandenburg Gate, the exquisite Sanssouci Palace and the magnificent Cecilienhof Palace.",
  atractivos:[
   ["Sanssouci Palace","summer residence of Frederick the Great · UNESCO Heritage"],
   ["Cecilienhof Palace","site of the Potsdam Conference (1945) · where the Peace Treaty was signed"],
   ["City Palace (Stadtschloss)","reconstructed palace · seat of the Brandenburg Parliament"],
   ["St. Nicholas Church","neoclassical church with a large dome · in the historic center"],
   ["Brandenburg Gate de Potsdam","not to be confused with Berlin's · 18th-century baroque"],
  ],
  recomendados:[
   ["Sanssouci Park","300 hectares of interconnected gardens and palaces · very photogenic"],
   ["Dutch Quarter (Holländisches Viertel)","18th-century Dutch-style houses · unique in Germany"],
  ],
  gastronomia:["Same German cuisine as Berlin · bratwurst, pretzels, schnitzel","Cafés by Sanssouci park with a more refined atmosphere than Berlin","Restaurants in the Dutch Quarter with a bohemian vibe"],
  restaurantes:[
   ["Café Lubitsch","facing the palace · historic café with a terrace"],
   ["Restaurant Juliette","French-German cuisine in the Dutch Quarter"],
  ],
  saludos:{idioma:"German (Deutsch)",nota:"Hanoverian German is considered the purest German. Potsdam is 100% German — any greeting in German is always appreciated.",frases:[
   {cat:"🌅 Good morning",local:"Guten Morgen",pron:"GOO-ten MOR-gen",tip:"Use until about 11 am"},
   {cat:"☀️ Good day",local:"Guten Tag",pron:"GOO-ten TAHK",tip:"The safest all-day greeting"},
   {cat:"🙏 Please",local:"Bitte",pron:"BIT-uh",tip:"Also means 'here you go' when handing something"},
   {cat:"😊 Thank you",local:"Danke schön",pron:"DAHN-kuh shurn",tip:"Just Danke also works perfectly"},
   {cat:"🍺 Cheers!",local:"Prost!",pron:"Prohst",tip:"The classic German toast"},
  ]},
  mapa:{centro:"Potsdam Germany",pois:[["Sanssouci Palace","Sanssouci Palace Potsdam"],["Cecilienhof Palace","Cecilienhof Palace Potsdam"],["Brandenburg Gate Potsdam","Brandenburg Gate Potsdam"],["St. Nicholas Church","St Nicholas Church Potsdam"]]},
  video:{t:"Potsdam Germany - Sanssouci Palace, Cecilienhof & Historic Center Walking Tour 2025",u:"https://www.youtube.com/watch?v=h3iL0_J3L48"}
 },
 {id:"aus",wlat:50.0274,wlon:19.2037,name:"Auschwitz-Birkenau",flag:"🇵🇱",
  precio:"$95 USD",base:"From Kraków · 47 mi · 1h 15min",
  desc:"The museum comprises two concentration camps: Auschwitz I and Auschwitz-Birkenau, with their guard towers, death block, crematorium, death wall, train tracks with ramp, barracks and watchtowers. A deeply moving and historic visit, considered a monument to the victims of the Holocaust.",
  atractivos:[
   ["Campo Auschwitz I","main camp · entrance with the 'Arbeit Macht Frei' sign · death block · crematorium"],
   ["Campo Auschwitz II-Birkenau","the largest extermination camp · gas chamber ruins · train tracks with ramp"],
   ["Muro de la muerte","execution site between blocks 10 and 11"],
   ["Torres de vigilancia","preservadas tal como estaban en 1945"],
   ["Museo Estatal","UNESCO Heritage since 1979 · one of the world's most visited historic sites"],
  ],
  recomendados:[
   ["Official guided tour","highly recommended · the memorial guides provide invaluable historical context"],
   ["Early arrival","the memorial opens at 7:30 · arrive before 9:00 to avoid crowds"],
  ],
  gastronomia:["Memorial visit · bring water and a snack · no restaurants on site","Town of Oświęcim 2 km away with traditional Polish restaurants","Basic cafeteria available at the memorial entrance"],
  restaurantes:[
   ["Restaurantes en Oświęcim","2 km from the memorial · traditional Polish cuisine"],
  ],
  saludos:{idioma:"Polish (Polski)",nota:"Any attempt at Polish creates enormous goodwill. The memorial visit is solemn — greetings are discreet.",frases:[
   {cat:"🌅 Good morning",local:"Dzień dobry",pron:"Jen DOH-bry",tip:"The safest and most formal greeting"},
   {cat:"🙏 Please",local:"Proszę",pron:"PROH-sheh",tip:"Also means 'here you go' and 'you're welcome'"},
   {cat:"😊 Thank you",local:"Dziękuję",pron:"Jen-KOO-yeh",tip:"Quick version: Dzięki (JEN-kee)"},
   {cat:"🤝 You're welcome",local:"Nie ma za co",pron:"Nyeh-mah-ZAH-tsoh",tip:"Literally 'don't mention it'"},
  ]},
  mapa:{centro:"Auschwitz-Birkenau Memorial Poland",pois:[["Campo Auschwitz I","Auschwitz I Memorial Museum"],["Campo Birkenau","Auschwitz II Birkenau"],["Entrada principal","Auschwitz Memorial entrance"]]},
  video:{t:"Auschwitz-Birkenau Memorial - Complete Guided Visit (English) 2025",u:"https://www.youtube.com/watch?v=dWgcbVIt5jE"}
 },
 {id:"mol",wlat:50.0755,wlon:14.4378,name:"Vltava River Cruise",flag:"🇨🇿",
  precio:"$66 USD",base:"From Prague city center",
  desc:"We board a pleasure boat for a romantic night cruise through the heart of Prague. We see majestic landmarks like Charles Bridge, the Dancing House, Petrin Tower and the historic Vysehrad fort. We admire the neo-Renaissance Rudolfinum concert hall and the world's largest castle complex, Prague Castle.",
  atractivos:[
   ["Charles Bridge","seen from the water · a unique perspective impossible from land"],
   ["Casa Danzante (Ginger & Fred)","iconic deconstructivist building by Frank Gehry"],
   ["Torre Petrin","lookout tower on the hill · lit up at night"],
   ["Fuerte de Vysehrad","historic riverside fortress · legendary in Czech history"],
   ["Rudolfinum","neo-Renaissance concert hall · home of the Czech Philharmonic"],
   ["Prague Castle","the world's largest castle complex · seen in all its majesty"],
  ],
  recomendados:[
   ["Night cruise","the night version with Prague illuminated is the most impressive"],
   ["Dinner cruise","some options include Czech dinner and live music on board"],
  ],
  gastronomia:["Algunos cruceros incluyen cena checa y bebidas a bordo","Dinner-cruise options with live traditional Bohemian music","Svíčková (sirloin in cream sauce) · the most representative Czech dish"],
  restaurantes:[
   ["Restaurantes frente al Moldava","riverside terrace · views of Charles Bridge"],
  ],
  saludos:{idioma:"Czech (Čeština)",nota:"Czechs may seem reserved at first, but hearing you try their language changes everything.",frases:[
   {cat:"👋 Hello (anytime)",local:"Dobrý den",pron:"DOH-bree den",tip:"The most versatile - safe all-day formal greeting"},
   {cat:"👋 Hi (informal)",local:"Ahoj",pron:"AH-hoy",tip:"Informal and friendly - sounds just like 'ahoy'!"},
   {cat:"🙏 Please",local:"Prosím",pron:"PROH-seem",tip:"Also means 'here you go' and 'you're welcome'"},
   {cat:"😊 Thank you",local:"Děkuji",pron:"DJEH-koo-yee",tip:"Informal: Díky (DEE-kee) - very common"},
   {cat:"🍺 Cheers!",local:"Na zdraví!",pron:"Nah ZDRAH-vee",tip:"Essential! · make eye contact when toasting"},
  ]},
  mapa:{centro:"Vltava River Prague",pois:[["Charles Bridge","Charles Bridge Prague"],["Casa Danzante","Dancing House Prague"],["Rudolfinum","Rudolfinum Prague"],["Vysehrad","Vysehrad Fortress Prague"]]},
  video:{t:"Prague Vltava River Cruise - Best Night Tour of the City",u:"https://www.youtube.com/watch?v=oHRjFpZiAJ4"}
 },
 {id:"rot",wlat:49.3774,wlon:10.1798,name:"Rothenburg ob der Tauber",flag:"🇩🇪",
  precio:"$90 USD",base:"From Nuremberg · 62 mi · 1h",
  desc:"The Red Castle over the Tauber River. We enter beneath the Entrance Tower and are greeted by typical medieval German houses with rows of flowers on their facades. We visit the Town Hall and the Defensive Tower. A visit to Rothenburg ob der Tauber is a unique experience.",
  atractivos:[
   ["Torre de Entrada (Rödertor)","main entrance to the walled medieval town"],
   ["Town Hall (Rathaus)","13th-century Renaissance with a panoramic tower · on the Marktplatz"],
   ["Torre Defensiva","part of the perfectly preserved medieval wall system"],
   ["Murallas medievales","3.5 km walkable in perfect condition · valley views"],
   ["Käthe Wohlfahrt","the world's most famous Christmas shop · open year-round"],
  ],
  recomendados:[
   ["Night Watchman Tour","guided evening walk along the walls at sunset · very popular"],
   ["Krimin agoalmuseum","medieval justice museum with 13th-century torture instruments"],
  ],
  gastronomia:["Schneeballen: fried dough balls dusted with sugar · the iconic local sweet","Schäufele: oven-roasted pork shoulder with crispy crust · Franconian recipe","Roast lamb with medieval sides at the square's restaurants"],
  restaurantes:[
   ["Restaurantes en la Marktplatz","medieval central square · tourist menus with Franconian cuisine"],
   ["Café on the wall","cafés inside the wall towers with valley views"],
  ],
  saludos:{idioma:"German (Deutsch) · Franconian dialect",nota:"Rothenburg is 100% German. The local dialect has Franconian influence but standard German works perfectly.",frases:[
   {cat:"🌅 Good morning",local:"Guten Morgen",pron:"GOO-ten MOR-gen",tip:"Standard German - always correct"},
   {cat:"👋 Hi (Franconian)",local:"Grüß Gott",pron:"Grooss Gott",tip:"Traditional Bavarian-Franconian greeting"},
   {cat:"🙏 Please",local:"Bitte",pron:"BIT-uh",tip:"Universal throughout Germany"},
   {cat:"😊 Thank you",local:"Danke schön",pron:"DAHN-kuh shurn",tip:"También: Vergelt's Gott en dialecto local"},
   {cat:"🍺 Cheers!",local:"Prost!",pron:"Prohst",tip:"With Franconian beer · the full experience"},
  ]},
  mapa:{centro:"Rothenburg ob der Tauber Germany",pois:[["Town Hall","Rothenburg Rathaus"],["Torre de Entrada","Rödertor Rothenburg"],["Murallas medievales","Medieval Walls Rothenburg"],["Käthe Wohlfahrt","Kathe Wohlfahrt Rothenburg"]]},
  video:{t:"Rothenburg ob der Tauber Germany - Most Magical Medieval Town Walking Tour",u:"https://www.youtube.com/watch?v=ZkYGaQ0-jgU"}
 },
 {id:"lxp",wlat:49.6116,wlon:6.1319,name:"Luxembourg City",flag:"🇱🇺",
  precio:"$54 USD",base:"From Metz · 34 mi · 45 min",
  desc:"Luxembourg, capital of the Grand Duchy of Luxembourg, one of Europe's smallest states, sits atop a rocky promontory. During our tour we visit los edificios del Grand Ducal Palace, la Legislatura Nacional, la Neumünster Abbey y el pintoresco valle del Río Alzette.",
  atractivos:[
   ["Grand Ducal Palace","official residence of the Grand Duke · changing of the guard · Spanish Renaissance architecture"],
   ["Legislatura Nacional (Chambre des Députés)","parliament of the Grand Duchy of Luxembourg"],
   ["Neumünster Abbey","former Benedictine abbey turned cultural center"],
   ["Alzette River Valley","picturesque valley around the city · views from the Corniche"],
   ["Bock Casemates","21 km de túneles subterráneos excavados en roca · Patrimonio UNESCO"],
  ],
  recomendados:[
   ["Chemin ago de la Corniche","'the most beautiful balcony in Europe' · panoramic views over the Alzette"],
   ["Old Town (Ville Haute)","UNESCO Heritage · perfectly preserved medieval lanes"],
  ],
  gastronomia:["Judd mat Gaardebounen: smoked pork collar with broad beans · Luxembourg national dish","Gromperekichelcher: spiced potato cakes · typical street food","Luxembourg Moselle wines at downtown wineries · excellent dry whites"],
  restaurantes:[
   ["Restaurantes en la Place d'Armes","central square · many dining options"],
   ["Mercado Guillaume","fresh local products · lively atmosphere"],
  ],
  saludos:{idioma:"Luxembourgish · French · German",nota:"Luxembourg has 3 official languages. French is the most practical. A greeting in Luxembourgish is very special.",frases:[
   {cat:"🌅 Good morning (Lux.)",local:"Gudde Moien",pron:"GOO-duh MOY-en",tip:"The most special greeting you can give!"},
   {cat:"☀️ Good day (French)",local:"Bonjour",pron:"Bohn-ZHOOR",tip:"Safe and universal throughout the city"},
   {cat:"🙏 Please (French)",local:"S'il vous plaît",pron:"Seel-voo-PLAY",tip:"Essential at shops and cafés"},
   {cat:"😊 Thank you",local:"Merci",pron:"Mair-SEE",tip:"Same in all 3 languages"},
   {cat:"🍺 Cheers!",local:"Prost! / Santé!",pron:"Prohst / Sahn-TAY",tip:"German Prost and French Santé - both are correct here"},
  ]},
  mapa:{centro:"Luxembourg City Luxembourg",pois:[["Grand Ducal Palace","Grand Ducal Palace Luxembourg"],["Neumünster Abbey","Neumünster Abbey Luxembourg"],["Bock Casemates","Bock Casemates Luxembourg"],["Chemin ago de la Corniche","Corniche Luxembourg"]]},
  video:{t:"Luxembourg City - Europe's Hidden Gem Complete Travel Guide 2026",u:"https://www.youtube.com/watch?v=1jsQXl3i82M"}
 },
 {id:"str",wlat:48.5734,wlon:7.7521,name:"Strasbourg y Colmar",flag:"🇫🇷",
  precio:"$186 USD",base:"From Metz · 134 mi · 2h",
  desc:"In Strasbourg we see medieval architecture with its black-and-white designs, the old Romanesque church, the huge Gothic cathedral and the famous bridges over the Rhine. Entering the French city of Colmar we see St. Martin's Church, the Pfister House, the House of Heads and the many canals with flower-covered banks.",
  atractivos:[
   ["Notre-Dame Cathedral (Strasbourg)","14th-century Gothic · 142 m · one of the tallest in the world"],
   ["Arquitectura medieval blanco-negra","Alsatian half-timbering · designs unique in Europe"],
   ["Puentes sobre el Rin","panoramic view of the famous bridges between France and Germany"],
   ["St. Martin's Church (Colmar)","13th-century Gothic church · heart of Colmar's old town"],
   ["Pfister House (Colmar)","16th-century building · jewel of the Alsatian Renaissance"],
   ["House of Heads (Colmar)","facade decorated with 106 grotesque 17th-century heads"],
   ["Flower-lined canals (Colmar)","Little Venice quarter · flower-lined canals · very photogenic"],
  ],
  recomendados:[
   ["Petite France District (Strasbourg)","canals and medieval half-timbered houses · UNESCO Heritage · the most photogenic"],
   ["Petite Venise District (Colmar)","Colmar's canals are even more picturesque than Strasbourg's"],
  ],
  gastronomia:["Choucroute garnie: sauerkraut with cured meats and potatoes · the definitive Alsatian regional dish","Flammekueche (Tarte flambée): Alsatian pizza with cream, onion and lardons","Kougelhopf: Alsatian cake with almonds and raisins · great to take away","Alsace wines: Riesling and Gewürztraminer · the best in France"],
  restaurantes:[
   ["Winstubs de Strasbourg","traditional Alsatian restaurants · intimate and authentic atmosphere"],
   ["Restaurants along the Colmar canals","waterside terrace · choucroute and local wines"],
  ],
  saludos:{idioma:"Francés (Français) · Alsacia",nota:"Alsace has a unique identity between France and Germany. French is the official language but many speak German and the Alsatian dialect.",frases:[
   {cat:"🌅 Good morning",local:"Bonjour",pron:"Bohn-ZHOOR",tip:"The most important French greeting - always say this before asking anything"},
   {cat:"🙏 Please",local:"S'il vous plaît",pron:"Seel-voo-PLAY",tip:"Obligatorio antes de pedir cualquier cosa"},
   {cat:"😊 Thank you",local:"Merci beaucoup",pron:"Mair-SEE boh-KOO",tip:"Beaucoup = a lot - just Merci also works perfectly"},
   {cat:"🍺 Cheers!",local:"Santé!",pron:"Sahn-TAY",tip:"Make eye contact · French tradition"},
   {cat:"😋 Bon appétit!",local:"Bon appétit!",pron:"Bohn ah-pay-TEE",tip:"Dilo al sentarse a comer"},
  ]},
  mapa:{centro:"Strasbourg France",pois:[["Notre-Dame Cathedral Strasbourg","Strasbourg Cathedral"],["Barrio Petite France","Petite France Strasbourg"],["St. Martin Colmar","Eglise Saint-Martin Colmar"],["Pequeña Venecia Colmar","Petite Venise Colmar"]]},
  video:{t:"Strasbourg & Colmar France - Complete Alsace Travel Guide (English)",u:"https://www.youtube.com/watch?v=Aj0xt65fhJ8"}
 },
 {id:"brug",wlat:51.2093,wlon:3.2247,name:"Bruges y Ghent",flag:"🇧🇪",
  precio:"$114 USD",base:"Bruges: 60 mi (1h) · Ghent: 34 mi (35min) from Brussels",
  desc:"The Belgian city of Bruges is one of the pearls of European architecture. The most striking building rising above the lacework of narrow medieval streets and canals is the stunning Belfry of Bruges. Ghent is another famous Belgian city. During our visit we enjoy the sight of buildings lining the banks of the two rivers like beads on an exquisite necklace.",
  atractivos:[
   ["Belfry of Bruges (Belfort)","83 m · symbol of Bruges · UNESCO Heritage · views from the top"],
   ["Medieval streets and canals of Bruges","the 'Venice of the North' · lacework of cobblestones and 13th-century bridges"],
   ["Banks of the two rivers (Ghent)","Lys and Scheldt · historic buildings lining the banks"],
   ["Graslei y Korenlei (Ghent)","Ghent's two most photogenic quays · medieval guildhalls"],
   ["Castle of the Counts (Ghent)","Gravensteen · 12th-century medieval castle · perfectly preserved"],
  ],
  recomendados:[
   ["Boat ride through Bruges canals","see the city from the water · a must · 30 min"],
   ["Ghent chocolate market","the best artisan Belgian chocolate · shops in the historic center"],
  ],
  gastronomia:["Carbonnade flamande: beef stew with Belgian beer · traditional Bruges dish","Ghent Waterzooi: creamy chicken or fish stew · Ghent's national dish","Brussels and Liège Gaufres: authentic Belgian waffles · at street stalls","Belgian Trappist beer: over 1,500 varieties · Bruges Zot and Gentse Strop are local"],
  restaurantes:[
   ["Restaurants on the Burg (Bruges)","main historic square · traditional Flemish cuisine"],
   ["Restaurantes en Graslei (Ghent)","facing the canal · unique atmosphere · Ghent cuisine"],
  ],
  saludos:{idioma:"Dutch (Flemish) · French",nota:"Bruges and Ghent are in Flanders. Dutch/Flemish is the main language. A Flemish greeting opens all doors.",frases:[
   {cat:"🌅 Good morning",local:"Goedemorgen",pron:"HOO-duh-MOR-khen",tip:"In Flemish - same as in Amsterdam"},
   {cat:"👋 Hi (informal)",local:"Hoi / Dag",pron:"Jói / Daj",tip:"Dag is more typical of Flanders than Amsterdam"},
   {cat:"🙏 Please",local:"Alstublieft",pron:"AHL-stoo-BLEEFT",tip:"Essential at shops and cafés"},
   {cat:"😊 Thank you",local:"Dank u wel",pron:"DAHNK oo vel",tip:"Formal · informal: Dank je (dank ye)"},
   {cat:"🍺 Cheers!",local:"Proost!",pron:"Prohst",tip:"With Belgian beer · the full experience"},
  ]},
  mapa:{centro:"Bruges Belgium",pois:[["Belfry of Bruges","Belfort Bruges"],["Bruges Canals","Bruges Canals"],["Graslei Ghent","Graslei Ghent"],["Castle of the Counts","Gravensteen Ghent"]]},
  video:{t:"Bruges & Ghent Belgium - Best Medieval Cities Complete Guide 2025",u:"https://www.youtube.com/watch?v=t4GCgF_XMp4"}
 },
 {id:"wie",wlat:49.9839,wlon:20.0550,name:"Wieliczka Salt Mine",flag:"🇵🇱",
  precio:"$95 USD",base:"From Kraków · 9 mi · 20 min",
  desc:"For their grandeur these mines, producing salt since the 13th century, have earned the name The Underground Cathedral. They reach 327 meters deep and over 300 km in length. During the tour you can see statues of mythical and historical figures, carved into the salt rock by the miners.",
  atractivos:[
   ["St. Kinga's Chapel","chapel carved entirely from salt rock · the most impressive in the underground world"],
   ["Estatuas de sal","sculptures of mythical and historical figures carved by the miners"],
   ["Lago subterráneo","espejos de agua salada verde · paisaje único"],
   ["Profundidad de 327 metros","9 levels · over 300 km of galleries"],
   ["Patrimonio UNESCO","on the list since 1978 · one of the first mines in the world to receive it"],
  ],
  recomendados:[
   ["Official guided tour","mandatory · guides have access to special areas"],
   ["Miner's Route","more adventurous alternative · in less touristy areas"],
  ],
  gastronomia:["Obwarzanek krakowski: braided bread ring · Kraków culinary icon since the 14th century","Kraków Pierogi: local version with various fillings · the best in Poland","Restaurants in Wieliczka town · traditional Polish cuisine at local prices"],
  restaurantes:[
   ["Restaurant inside the mine","underground restaurant 135 m deep · a unique experience"],
   ["Restaurantes en Wieliczka","adjacent town · authentic Polish cuisine"],
  ],
  saludos:{idioma:"Polish (Polski)",nota:"Any attempt at Polish creates enormous goodwill with the locals in Wieliczka.",frases:[
   {cat:"🌅 Good morning",local:"Dzień dobry",pron:"Jen DOH-bry",tip:"Works all day - the safest greeting"},
   {cat:"🙏 Please",local:"Proszę",pron:"PROH-sheh",tip:"Also means 'here you go' and 'you're welcome'"},
   {cat:"😊 Thank you",local:"Dziękuję",pron:"Jen-KOO-yeh",tip:"Quick version: Dzięki (JEN-kee)"},
   {cat:"🍺 Cheers!",local:"Na zdrowie!",pron:"Nah ZDROH-vyeh",tip:"The Polish toast · excellent Polish beer"},
  ]},
  mapa:{centro:"Wieliczka Salt Mine Poland",pois:[["Entrada principal Wieliczka","Wieliczka Salt Mine entrance"],["Capilla Santa Kinga","Chapel of St Kinga Wieliczka"],["Pueblo de Wieliczka","Wieliczka town center"]]},
  video:{t:"Wieliczka Salt Mine Poland - Underground Cathedral Complete Tour (English)",u:"https://www.youtube.com/watch?v=h_qGDOyU3tM"}
 },
 {id:"kv",wlat:50.2316,wlon:12.8716,name:"Karlovy Vary",flag:"🇨🇿",
  precio:"$90 USD",base:"From Prague · 81 mi · 1h 30min",
  desc:"Karlovy Vary is one of Europe's most famous spa towns, located at the confluence of the Eger and Teplá rivers. We take a walk to enjoy its picturesque architecture and natural surroundings.",
  atractivos:[
   ["Fuentes termales","12 springs · each with different temperature and mineral properties"],
   ["Colonnade Mill (Mlýnská kolonáda)","the largest and most imposing · neo-Renaissance · 19th century"],
   ["Market Colonnade","the oldest and liveliest · in the center of the spa town"],
   ["19th-century architecture","elegant period buildings that hosted kings, writers and musicians"],
   ["Río Teplá","riverside walk among the grand spa hotels"],
  ],
  recomendados:[
   ["Taste the thermal springs","bring a special spa cup · each spring tastes different"],
   ["Becherovka Liqueur","the famous herbal liqueur created in Karlovy Vary in 1807 · visit the factory"],
  ],
  gastronomia:["Oplatky: spa wafers · Karlovy Vary's edible souvenir · at every stall","Becherovka: licor de hierbas amargo · creado aquí en 1807 · probar en la fuente original","Traditional Czech cuisine: svíčková, goulash and knedlíky at downtown restaurants"],
  restaurantes:[
   ["Restaurantes en la Colonnade","facing the springs · elegant spa atmosphere"],
   ["Old town cafés","period architecture · Czech coffee and local pastries"],
  ],
  saludos:{idioma:"Czech (Čeština)",nota:"The most elegant spa city in Czechia. Czechs really appreciate any attempt to speak their language.",frases:[
   {cat:"👋 Hello (anytime)",local:"Dobrý den",pron:"DOH-bree den",tip:"The most versatile - safe all-day formal greeting"},
   {cat:"👋 Hi (informal)",local:"Ahoj",pron:"AH-hoy",tip:"Informal and friendly · very common among young people"},
   {cat:"🙏 Please",local:"Prosím",pron:"PROH-seem",tip:"Also means 'here you go' and 'you're welcome'"},
   {cat:"😊 Thank you",local:"Děkuji",pron:"DJEH-koo-yee",tip:"Informal: Díky (Dí-ki)"},
   {cat:"🍺 Cheers!",local:"Na zdraví!",pron:"Nah ZDRAH-vee",tip:"Czech toast · make eye contact"},
  ]},
  mapa:{centro:"Karlovy Vary Czech Republic",pois:[["Colonnade Mill","Mlynska Kolonada Karlovy Vary"],["Fuentes termales","Hot Springs Karlovy Vary"],["Market Colonnade","Market Colonnade Karlovy Vary"]]},
  video:{t:"Karlovy Vary Czech Republic - Spa Town Travel Guide (English) 2024",u:"https://www.youtube.com/watch?v=B4MuEKO1UNE"}
 },
 {id:"mun",wlat:48.1351,wlon:11.5820,name:"Múnich",flag:"🇩🇪",
  precio:"$174 USD",base:"From Nuremberg · 106 mi · 1h 45min",
  desc:"The city of Munich has existed on the banks of the Isar River for at least 4,000 years. During our tour of the royal streets we visit Munich Cathedral, the Town Hall with its elaborate turrets and masterful sculptures, and the Feldherrnhalle — a loggia dedicated to the Bavarian army with beautiful decoration.",
  atractivos:[
   ["Munich Cathedral (Frauenkirche)","two 99 m twin towers · symbol of the city · 15th century"],
   ["Town Hall Nuevo (Neues Rathaus)","elaborate turrets and sculptures · the Glockenspiel plays at 11 am and noon"],
   ["Feldherrnhalle","logia neorrenacentista dedicada al ejército de Baviera · exquisita decoración"],
   ["Marienplatz","Munich's central square · the city's heart since the 13th century"],
   ["Hofbräuhaus","the world's most famous brewery · founded in 1589 by the Duke of Bavaria"],
  ],
  recomendados:[
   ["English Garden (Englischer Garten)","the largest urban park in the world · surfers on the Eisbach river"],
   ["Viktualienmarkt","open-air gourmet market · since 1807 · Bavarian cuisine"],
  ],
  gastronomia:["Weisswurst: Bavarian white sausage · eaten only before noon · with pretzel and sweet mustard","Schweinshaxe: roasted pork knuckle · crispy skin · with sauerkraut and knödel","Maß (beer) at the Hofbräuhaus · the definitive Bavarian experience · 1-liter steins"],
  restaurantes:[
   ["Hofbräuhaus","the most famous brewery in the world · touristy but authentic"],
   ["Viktualienmarkt","gourmet market with traditional Bavarian food stalls"],
  ],
  saludos:{idioma:"German (Deutsch) · Bavarian dialect",nota:"Munich has its own very distinct Bavarian dialect. A local greeting generates great goodwill.",frases:[
   {cat:"🌅 Good morning",local:"Guten Morgen",pron:"GOO-ten MOR-gen",tip:"Standard German - always correct"},
   {cat:"👋 Hi (Bavarian)",local:"Grüß Gott",pron:"Grooss Gott",tip:"The traditional Bavarian greeting · 'God greet you'"},
   {cat:"👋 Hi (very casual)",local:"Servus",pron:"ZAIR-voos",tip:"Very typical of Munich · casual and friendly"},
   {cat:"🙏 Please",local:"Bitte",pron:"BIT-uh",tip:"Universal throughout Germany"},
   {cat:"🍺 Cheers!",local:"Prost!",pron:"Prohst",tip:"At the Hofbräuhaus with a Maß (liter) of beer"},
  ]},
  mapa:{centro:"Munich Germany",pois:[["Frauenkirche","Frauenkirche Munich"],["Town Hall Nuevo","Neues Rathaus Munich"],["Feldherrnhalle","Feldherrnhalle Munich"],["Hofbräuhaus","Hofbrauhaus Munich"],["Marienplatz","Marienplatz Munich"]]},
  video:{t:"Munich Germany - Complete Travel Guide Top Things To Do 2025",u:"https://www.youtube.com/watch?v=QBNyYhb6Mq4"}
 },
 {id:"noc",wlat:50.0755,wlon:14.4378,name:"Noche Checa con cena",flag:"🇨🇿",
  precio:"$90 USD",base:"In Prague (evening)",
  desc:"We capture the uplifting spirit of Czech folklore during a 2-hour traditional folk show that includes dinner. It's a truly different and entertaining way to spend an evening in Prague.",
  atractivos:[
   ["Espectáculo folclórico checo","2 hours of live traditional Bohemian dance and music"],
   ["Dinner included","full traditional Czech menu · 3 courses · local drinks"],
   ["Música en vivo","traditional Czech instruments · accordion, violin and Bohemian percussion"],
   ["Trajes regionales","performers wear authentic folk costumes from different Czech regions"],
  ],
  recomendados:[
   ["Order local Czech beer","the world's best beer · Pilsner Urquell or Budvar · included or very cheap"],
   ["Svíčková for dinner","the star Czech dish · beef sirloin in cream sauce with knedlíky"],
  ],
  gastronomia:["Czech dinner included in the tour · 3 traditional courses","Svíčková na smetaně: sirloin in cream sauce with knedlíky · Czech national dish","Pilsner Urquell or Budvar: the world's best beer · available on board","Trdelník: pastry rolled on a spit · traditional Bohemian dessert"],
  restaurantes:[
   ["Folk show venue","dinner included in the tour price · authentic Czech cuisine"],
  ],
  saludos:{idioma:"Czech (Čeština)",nota:"A Czech folk evening is the most authentic cultural experience in Prague. The hosts appreciate any attempt to speak Czech.",frases:[
   {cat:"😊 Thank you",local:"Děkuji",pron:"DJEH-koo-yee",tip:"To thank for the dinner and show"},
   {cat:"🍺 Cheers!",local:"Na zdraví!",pron:"Nah ZDRAH-vee",tip:"The mandatory toast - make eye contact!"},
   {cat:"😋 Bon appétit!",local:"Dobrou chuť",pron:"DOH-broh khoot",tip:"Before the Czech dinner"},
   {cat:"👏 Bravo!",local:"Výborně!",pron:"VEE-bor-nyeh",tip:"To applaud the folk show"},
  ]},
  mapa:{centro:"Prague Czech Republic",pois:[["Prague city center","Prague Old Town Square"],["Teatro de folclore","Prague folk show restaurants"]]},
  video:{t:"Czech Folk Evening - Traditional Prague Dinner Show",u:"https://www.youtube.com/watch?v=v_XlJVJaVHc"}
 },
 {id:"bar",wlat:50.1109,wlon:8.6821,name:"Main River Cruise",flag:"🇩🇪",
  precio:"$42 USD",base:"In Frankfurt (from the Römerberg)",
  desc:"This ride offers a unique chance to watch life in the bustling commercial and financial center from the calm of the mighty Main River.",
  atractivos:[
   ["Skyline financiero de Frankfurt","the financial district skyscrapers seen from the water · a unique contrast"],
   ["Römerberg from the river","the medieval old town seen from the water"],
   ["Main riverbanks (Museumsufer)","museum walk along the river · Germany's most cultural riverbank"],
   ["Historic Main bridges","several historic pedestrian bridges with views of the center"],
  ],
  recomendados:[
   ["Combine with a Römerberg visit","do the boat after exploring the historic center on foot"],
   ["Sunset on the Main","the sunset cruise with the illuminated skyline is especially impressive"],
  ],
  gastronomia:["Ebbelwoi (Apfelwein): Frankfurt apple wine · tart flavor · at Sachsenhausen taverns","Grüne Soße: salsa verde de 7 hierbas frescas · especialidad única de Frankfurt","Handkäse mit Musik: strong cheese with onion and vinaigrette · the quintessential Hessian snack"],
  restaurantes:[
   ["Tabernas de Sachsenhausen","cider house district · across the Main from downtown"],
   ["Restaurantes en el Römerberg","central historic square · traditional German cuisine"],
  ],
  saludos:{idioma:"German (Deutsch) · Hessian dialect",nota:"Frankfurt is Germany's most cosmopolitan city — English is widely spoken but any German greeting opens doors.",frases:[
   {cat:"👋 Hi (Hessian local)",local:"Guude!",pron:"GOO-duh",tip:"Frankfurt's signature greeting - very local and appreciated"},
   {cat:"🙏 Please",local:"Bitte",pron:"BIT-uh",tip:"Multi-use: asking, thanking, and handing things over"},
   {cat:"😊 Thank you",local:"Danke",pron:"DAHN-kuh",tip:"Rápido y efectivo"},
   {cat:"🍺 Cheers!",local:"Prost! / Ebbelwei!",pron:"Prost / É-bel-vai",tip:"Ebbelwei is Frankfurt's apple wine"},
  ]},
  mapa:{centro:"Main River Frankfurt Germany",pois:[["Embarque barco Meno","Main River Cruise Frankfurt"],["Römerberg","Römerberg Frankfurt"],["Sachsenhausen","Sachsenhausen Frankfurt"],["Museumsufer","Museum Embankment Frankfurt"]]},
  video:{t:"Frankfurt Main River Cruise - Skyline & Historic Center from the Water",u:"https://www.youtube.com/watch?v=sBv7Zdp1NEg"}
 },
 {id:"sch",wlat:49.4667,wlon:6.3667,name:"Schengen City",flag:"🇱🇺",
  precio:"$54 USD",base:"From Metz · 37 mi · 50 min",
  desc:"Schengen is one of the best-known places in the world today. Here the borders of Luxembourg, Germany and France meet, and it was here that the Schengen Agreement was signed, under which several European countries abolished border controls among themselves, establishing an area of free movement of people and goods.",
  atractivos:[
   ["Monumento al Acuerdo de Schengen","on the Moselle bank · where the three borders meet"],
   ["Confluencia de tres países","Luxembourg, Germany and France · you can see all three countries from one spot"],
   ["European Museum de Schengen","documents the history of the agreement and borderless Europe"],
   ["Río Mosela","picturesque border river · walk along the banks among vineyards"],
   ["Moselle Vineyards","Luxembourg white wines on the hillsides by the river"],
  ],
  recomendados:[
   ["Stand in three countries","there's an exact point where you can have one foot in each country"],
   ["Moselle River Cruise","small river cruise along the border river · vineyard scenery"],
  ],
  gastronomia:["Luxembourg Moselle white wines · Riesling and Pinot Gris · excellent","Judd mat Gaardebounen: Luxembourg's national dish at local restaurants","Cocina de la Mosela: mezcla de influencias francesas, alemanas y luxemburguesas"],
  restaurantes:[
   ["Restaurantes en Schengen","border-region cuisine · local Moselle wines"],
   ["Moselle Wineries","Luxembourg wine tasting directly at the wineries"],
  ],
  saludos:{idioma:"Luxembourgish · French · German",nota:"Schengen is the symbol of united Europe. All three languages are spoken fluently. Any greeting in any of them works perfectly.",frases:[
   {cat:"🌅 Good morning (Lux.)",local:"Gudde Moien",pron:"GOO-duh MOY-en",tip:"The most special · Luxembourgish on Luxembourgish soil"},
   {cat:"☀️ Good day (French)",local:"Bonjour",pron:"Bohn-ZHOOR",tip:"Seguro y universal"},
   {cat:"☀️ Good day (German)",local:"Guten Tag",pron:"GOO-ten TAHK",tip:"For the German side of the border"},
   {cat:"🍺 Cheers!",local:"Prost! / Santé!",pron:"Prohst / Sahn-TAY",tip:"With Moselle wine · all three countries toast this way"},
  ]},
  mapa:{centro:"Schengen Luxembourg",pois:[["Schengen Monument","Schengen Monument Luxembourg"],["European Museum","European Museum Schengen"],["Confluencia tres fronteras","Schengen tripoint border"]]},
  video:{t:"Schengen Village Luxembourg - Where Europe's Open Borders Were Born",u:"https://www.youtube.com/watch?v=1jsQXl3i82M"}
 },
 {id:"vol",wlat:52.4946,wlon:5.0703,name:"Volendam, Marken y La Haya",flag:"🇳🇱",
  precio:"$138 USD",base:"From Amsterdam: Volendam 14 mi · The Hague 37 mi",
  desc:"This visit immerses us in the daily life of Dutch fishermen, with their typical colorful wooden houses and views of the IJsselmeer. The city of The Hague (Den Haag) is the administrative capital of the Kingdom of the Netherlands, on the North Sea coast. Contemporary The Hague amazes visitors with its impressive skyscrapers and the Binnenhof. Walking through the old town we see the luxurious residences of important figures, the Cathedral and the Peace Palace.",
  atractivos:[
   ["Volendam","fishing village with colorful wooden houses · traditional Dutch costumes · photogenic"],
   ["Marken","island village in the IJsselmeer · unique traditional architecture · car-free"],
   ["Binnenhof (La Haya)","historic Dutch parliament complex · 13th century · in continuous use"],
   ["Peace Palace (La Haya)","seat of the UN International Court of Justice"],
   ["The Hague Cathedral","imposing neo-Gothic cathedral in the old town"],
   ["Rascacielos de La Haya","striking contrast between the old town and modern skyscrapers"],
  ],
  recomendados:[
   ["Photo in traditional costume in Volendam","local photographers have authentic costumes · unique souvenir"],
   ["Mauritshuis (The Hague)","museum with Vermeer's 'Girl with a Pearl Earring' · one of the most famous paintings in the world"],
  ],
  gastronomia:["Fresh haring in Volendam straight from the harbor · the freshest in the Netherlands","Artisan stroopwafels at local markets · freshly made are infinitely better","Poffertjes: mini pancakes with butter and sugar · at Volendam stalls"],
  restaurantes:[
   ["Restaurantes en el puerto de Volendam","fresh IJsselmeer fish · authentic seafaring atmosphere"],
   ["Restaurantes en el centro de La Haya","Dutch and international cuisine · elegant and cosmopolitan"],
  ],
  saludos:{idioma:"Dutch (Nederlands)",nota:"Dutch is the official language. Almost everyone speaks English — but a local greeting makes a great impression!",frases:[
   {cat:"🌅 Good morning",local:"Goedemorgen",pron:"HOO-duh-MOR-khen",tip:"Use until about noon"},
   {cat:"👋 Hi (informal)",local:"Hoi / Hallo",pron:"Hoy / HAH-loh",tip:"Hoi is very casual and friendly"},
   {cat:"🙏 Please",local:"Alstublieft",pron:"AHL-stoo-BLEEFT",tip:"Often abbreviated s.v.p. on signs"},
   {cat:"😊 Thank you",local:"Dank u wel",pron:"DAHNK oo vel",tip:"Informal: Dank je (DAHNK yuh)"},
   {cat:"🍺 Cheers!",local:"Proost!",pron:"Prohst",tip:"The Dutch toast - used at every bar"},
  ]},
  mapa:{centro:"Volendam Netherlands",pois:[["Volendam Harbor","Volendam harbor Netherlands"],["Marken","Marken island Netherlands"],["Binnenhof La Haya","Binnenhof The Hague"],["Peace Palace","Peace Palace The Hague"]]},
  video:{t:"The Hague Netherlands - Volendam & Marken Day Trip from Amsterdam 2025",u:"https://www.youtube.com/watch?v=axSKpiV-RNI"}
 },
];


const distMain=[
 {de:"Amsterdam",a:"Hannover",mi:174,t:"2h 30min"},
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
 {de:"Kraków",a:"Minas Wieliczka",mi:9,t:"20min"},
 {de:"Nuremberg",a:"Rothenburg ob der Tauber",mi:62,t:"1h 00min"},
 {de:"Nuremberg",a:"Munich",mi:106,t:"1h 45min"},
 {de:"Metz",a:"Strasbourg",mi:134,t:"2h 00min"},
 {de:"Strasbourg",a:"Colmar",mi:47,t:"45min"},
 {de:"Metz",a:"Schengen City",mi:37,t:"50min"},
 {de:"Prague",a:"Karlovy Vary",mi:81,t:"1h 30min"},
 {de:"Brussels",a:"Ghent",mi:34,t:"30min"},
 {de:"Brussels",a:"Bruges",mi:59,t:"1h 00min"},
 {de:"Amsterdam",a:"Volendam/Marken",mi:14,t:"25min"},
 {de:"Amsterdam",a:"La Haya (Den Haag)",mi:37,t:"50min"},
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
 const tabs=[['itinerario','📋 From the Itinerary'],['recomendados','⭐ Recommended'],['gastronomia','🍽️ Local Cuisine'],['restaurantes','🍴 Where to Eat'],['saludos','🗣️ Greetings'],['mapa','🗺️ Map'],['fotos','📸 Photos'],['clima','🌤️ Weather'],['video','📺 Video']];
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
  h+=`<div class="card"><div class="card-header"><div class="card-title">🍽️ Gastronomía típica</div></div>`;
  h+=c.gastronomia.map(g=>`<div class="list-item"><span class="lb">◆</span><div class="list-text">${g[0]}<div class="list-sub">${g[1]}</div></div></div>`).join('');
  h+='</div>';
  h+=renderNotes(c.id,'gastronomia');
 } else if(curSub==='restaurantes'){
  h+=`<div class="card"><div class="card-header"><div class="card-title">🍴 Where to Eat on a Budget</div></div>`;
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
  h+=`<div class="card"><div class="card-header"><div class="card-title">🗺️ Map of ${c.name}</div><div class="card-sub">Tap any spot to open in Google Maps</div></div>`;
  h+=`<a class="vlink" href="${m.url}" target="_blank" rel="noopener" style="background:rgba(201,168,76,0.08)"><div class="pbtn" style="background:var(--gold);color:#0f1923">📍</div><div style="flex:1"><div class="vtitle">View ${c.name} overview map</div><div class="vdesc">Opens Google Maps on the historic district</div></div></a>`;
  h+=`<div class="section-label">📌 Tour Itinerary Spots</div>`;
  h+=m.pois.map(p=>`<a class="map-poi" href="https://www.google.com/maps/search/?api=1&query=${p[1]}" target="_blank" rel="noopener"><span class="poi-icon">📍</span><div class="poi-name">${p[0]}</div><span class="poi-arrow">↗</span></a>`).join('');
  h+='</div>';
 } else if(curSub==='fotos'){
  h+=renderFotos(c.id,c.name);
 } else if(curSub==='clima'){
  h+=`<div class="card"><div class="card-header"><div class="card-title">🌤️ Weather in ${c.name}</div><div class="card-sub">Auto-updates with connection · saves last data for offline use</div></div><div id="city-wx-body-${c.id}" style="padding:20px;text-align:center;color:var(--dim);font-size:13px">⏳ Loading weather...</div></div>`;
  if(c.wlat){setTimeout(()=>fetchWeather(c.id,c.name,c.wlat,c.wlon,'city-wx-body-'+c.id),50);}
 } else if(curSub==='video'){
  const savedVidUrl=localStorage.getItem('cityvid_url_'+c.id);
  const savedVidTitle=localStorage.getItem('cityvid_title_'+c.id);
  const displayUrl=savedVidUrl||c.video.u;
  const displayTitle=savedVidTitle||c.video.t;
  const displayCanal=savedVidUrl?'Video personalizado':c.video.canal;
  const displayDesc=savedVidUrl?'Video agregado manualmente':c.video.d;
  h+=`<div class="card"><div class="card-header"><div class="card-title">📺 Video de ${c.name}</div><div class="card-sub">Tap to watch on YouTube · you can change the link</div></div>`;
  if(displayUrl){
   h+=`<a class="vlink" href="${displayUrl}" target="_blank" rel="noopener"><div class="pbtn">▶</div><div><div class="vtitle">${displayTitle}</div><div class="vdesc">${displayDesc}</div><div style="font-size:12px;color:var(--gold);margin-top:4px">Canal: ${displayCanal}</div></div></a>`;
  } else {
   h+=`<div style="padding:14px;text-align:center;color:var(--dim);font-size:13px">No video assigned. Add a YouTube link below.</div>`;
  }
  h+=`<div class="note-add" style="border-top:1px solid rgba(201,168,76,0.15)">
   <div style="font-size:12px;color:var(--gold);margin-bottom:4px;font-weight:500">✏️ Change video:</div>
   <input type="url" id="cityvid-url-${c.id}" placeholder="https://www.youtube.com/watch?v=..." value="${displayUrl||''}" style="width:100%;background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:8px 10px;font-size:13px;color:var(--cream);font-family:inherit;outline:none;box-sizing:border-box;margin-bottom:6px">
   <input type="text" id="cityvid-title-${c.id}" placeholder="Video title (optional)" value="${displayTitle||''}" style="width:100%;background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:8px 10px;font-size:13px;color:var(--cream);font-family:inherit;outline:none;box-sizing:border-box">
   <div style="display:flex;gap:8px;margin-top:8px">
    <button class="note-add-btn" style="flex:1" onclick="saveCityVideo('${c.id}')">💾 Save</button>
    <button class="note-add-btn" style="flex:0.6;background:rgba(255,80,80,0.08);border-color:rgba(255,80,80,0.35);color:#ff6464" onclick="deleteCityVideo('${c.id}')">🗑 Delete</button>
   </div>
   ${savedVidUrl?'<div style="font-size:10px;color:var(--gold);margin-top:6px;text-align:center">⚡ Custom video active · the original is still saved in the code</div>':''}
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
 if(!url){alert('Please enter a YouTube link');return;}
 if(!url.includes('youtube')&&!url.includes('youtu.be')){alert('Please enter a valid YouTube link');return;}
 localStorage.setItem('cityvid_url_'+cityId,url);
 if(title)localStorage.setItem('cityvid_title_'+cityId,title);
 renderCityBody();
}
function deleteCityVideo(cityId){
 if(!confirm('Delete custom video and restore original?'))return;
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
 h+=`<div class="card-header"><div class="card-title">📝 My Notes · ${sectionTitle}</div><div class="card-sub">On this phone only · ${notes.length} ${notes.length===1?'note':'notes'} · tap to edit</div></div>`;
 if(notes.length){
  h+=notes.map((n,i)=>`
   <div class="note-row" id="note-row-${cityId}-${section}-${i}">
    <div class="note-content" onclick="editNote('${cityId}','${section}',${i})" style="cursor:pointer" title="Tap to edit">
     <div id="note-text-${cityId}-${section}-${i}">${escapeHtml(n.text)}</div>
     <div class="note-date">${n.date} · ✏️ toca para editar</div>
    </div>
    <button class="note-del" onclick="delNote('${cityId}','${section}',${i})">🗑</button>
   </div>
   <div id="note-edit-${cityId}-${section}-${i}" style="display:none;padding:8px 14px;background:rgba(94,203,122,0.05);border-bottom:1px solid rgba(94,203,122,0.15)">
    <textarea id="note-edit-ta-${cityId}-${section}-${i}" style="width:100%;background:var(--bg);border:1px solid #5ecb7a;border-radius:8px;padding:8px;font-size:14px;color:var(--cream);font-family:inherit;outline:none;resize:vertical;box-sizing:border-box">${escapeHtml(n.text)}</textarea>
    <div style="display:flex;gap:8px;margin-top:6px">
     <button class="note-add-btn" style="flex:1" onclick="saveEditNote('${cityId}','${section}',${i})">💾 Save changes</button>
     <button class="note-add-btn" style="flex:0.5;background:rgba(100,100,100,0.1);border-color:var(--border);color:var(--muted)" onclick="cancelEditNote('${cityId}','${section}',${i})">✕ Cancel</button>
    </div>
   </div>`).join('');
 } else {
  h+=`<div style="padding:12px 14px;font-size:13px;color:var(--dim);text-align:center">No notes added yet.<br>Use them as your travel diary 📔</div>`;
 }
 h+=`<div class="note-add">
  <textarea id="note-input-${cityId}-${section}" placeholder="Write a note (restaurant tip, visited place, etc.)" rows="2"></textarea>
  <button class="note-add-btn" onclick="addNote('${cityId}','${section}')">➕ Add note</button>
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
 notes[idx].date=now.toLocaleDateString('en-US',{day:'numeric',month:'short'})+' · '+now.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})+' (edited)';
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
 const dateStr=now.toLocaleDateString('en-US',{day:'numeric',month:'short'})+' · '+now.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'});
 notes.push({text:text,date:dateStr});
 saveNotes(cityId,section,notes);
 if(cityId.startsWith('tour_'))renderTourBody();else renderCityBody();
}
function delNote(cityId,section,idx){
 if(!confirm('Delete this note?'))return;
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
  const dateStr=now.toLocaleDateString('en-US',{day:'numeric',month:'short',year:'numeric'});
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
   counter.innerHTML=`${photos.length}/10 ${photos.length===1?'photo':'photos'}${isOver?' <span style="color:#ffa552">⚠ excede recomendado</span>':''}`;
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
  overlay.innerHTML=`<div class="photo-overlay-inner"><img src="${p.data}" alt=""><div class="photo-overlay-info">📅 ${p.date}</div><button class="photo-overlay-close" onclick="this.parentElement.parentElement.remove()">✕ Close</button></div>`;
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
  const dateStr=now.toLocaleDateString('en-US',{day:'numeric',month:'short',year:'numeric'});
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
     <div style="flex:1;min ago-width:0">
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
   <div class="card-sub">On this phone only · <span id="doc-counter-${cityId}">loading...</span></div>
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
    <div style="flex:1;min ago-width:0">
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
    <button class="doc-overlay-close" onclick="this.closest('.doc-overlay').remove()">✕ Close</button>
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
 const tourTabs=[['info','📋 Info'],['recomendados','⭐ Recommended'],['gastronomia','🍽️ Local Cuisine'],['restaurantes','🍴 Where to Eat'],['saludos','🗣️ Greetings'],['mapa','🗺️ Map'],['fotos','📸 Photos'],['clima','🌤️ Weather'],['video','📺 Video']];
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
  h+=`<div class="section-label">Main Attractions & Highlights</div>`;
  h+=t.atractivos.map(a=>`<div class="list-item"><span class="lb">◆</span><div class="list-text">${a[0]}<div class="list-sub">${a[1]}</div></div></div>`).join('');
  h+='</div>';
  h+=notasH;
 } else if(curTourSub==='recomendados'){
  h+=`<div class="card"><div class="card-header"><div class="card-title">⭐ Recommended in ${t.name}</div></div>`;
  const recs=t.recomendados||[];
  if(recs.length){
   h+=recs.map(a=>`<div class="list-item"><span class="lb2">◇</span><div class="list-text">${a[0]}<div class="list-sub">${a[1]}</div></div></div>`).join('');
  }else{
   h+=`<div style="padding:14px;font-size:13px;color:var(--dim);text-align:center">No additional recommendations</div>`;
  }
  h+='</div>';
  h+=notasH;
 } else if(curTourSub==='gastronomia'){
  h+=`<div class="card"><div class="card-header"><div class="card-title">🍽️ Local Cuisine in ${t.name}</div></div>`;
  h+=t.gastronomia.map(g=>`<div class="list-item"><span class="lb">◆</span><span class="list-text">${g}</span></div>`).join('');
  h+='</div>';
  h+=notasH;
 } else if(curTourSub==='restaurantes'){
  h+=`<div class="card"><div class="card-header"><div class="card-title">🍴 Where to Eat in ${t.name}</div></div>`;
  const rests=t.restaurantes||[];
  if(rests.length){
   h+=rests.map(r=>`<div class="list-item"><span class="lb">◆</span><div class="list-text">${r[0]}<div class="list-sub">${r[1]}</div></div></div>`).join('');
  }else{
   h+=`<div style="padding:14px;font-size:13px;color:var(--dim);text-align:center">No restaurants registered yet</div>`;
  }
  h+='</div>';
  h+=notasH;
 } else if(curTourSub==='saludos'){
  const s=t.saludos;
  h+=`<div class="card"><div class="card-header"><div class="card-title">🗣️ Useful Phrases in ${s.idioma}</div><div class="card-sub">${s.nota}</div></div>`;
  h+=s.frases.map(f=>`<div class="list-item"><span class="lb">◆</span><div class="list-text"><span style="color:var(--gold2);font-weight:500">${f.cat}</span><div style="font-size:15px;color:var(--cream);margin:3px 0">${f.local}</div><div style="font-size:12px;color:var(--gold);font-style:italic">Pronunciación: ${f.pron}</div><div class="list-sub">${f.tip}</div></div></div>`).join('');
  h+='</div>';
  h+=notasH;
 } else if(curTourSub==='mapa'){
  const m=t.mapa||{centro:t.name,pois:[]};
  const murl=`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(m.centro)}`;
  h+=`<div class="card"><div class="card-header"><div class="card-title">🗺️ Map of ${t.name}</div><div class="card-sub">Tap any spot to open in Google Maps</div></div>`;
  h+=`<a class="map-poi" href="${murl}" target="_blank" rel="noopener"><span class="poi-icon">🗺️</span><span class="poi-name">View ${t.name} overview map</span><span class="poi-arrow">›</span></a>`;
  if(m.pois&&m.pois.length){
   h+=`<div class="section-label">📌 Points of Interest</div>`;
   h+=m.pois.map(p=>`<a class="map-poi" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p[1])}" target="_blank" rel="noopener"><span class="poi-icon">📍</span><span class="poi-name">${p[0]}</span><span class="poi-arrow">›</span></a>`).join('');
  }
  h+='</div>';
  h+=notasH;
 } else if(curTourSub==='fotos'){
  h+=renderPhotos(t.id,t.name);
  h+=notasH;
 } else if(curTourSub==='clima'){
  h+=`<div class="card" id="tour-wx-${t.id}"><div class="card-header"><div class="card-title">🌤️ Weather in ${t.name}</div><div class="card-sub">Updates with connection · last saved data shown offline</div></div><div id="tour-wx-body-${t.id}" style="padding:20px;text-align:center;color:var(--dim);font-size:13px">⏳ Loading weather...</div></div>`;
  if(t.wlat){setTimeout(()=>fetchWeather(t.id,t.name,t.wlat,t.wlon,'tour-wx-body-'+t.id),50);}
  else{setTimeout(()=>{const el=document.getElementById('tour-wx-body-'+t.id);if(el)el.innerHTML='No location data available.';},50);}
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
 const tourTabs=[['info','📋 Info'],['recomendados','⭐ Recommended'],['gastronomia','🍽️ Local Cuisine'],['restaurantes','🍴 Where to Eat'],['saludos','🗣️ Greetings'],['mapa','🗺️ Map'],['fotos','📸 Photos'],['clima','🌤️ Weather'],['video','📺 Video']];
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
 let h=`<div class="card"><div class="card-header"><div class="card-title">📺 Video de ${t.name}</div><div class="card-sub">Tap to open on YouTube · you can customize the link</div></div>`;
 if(displayUrl){
  h+=`<a class="vlink" href="${displayUrl}" target="_blank" rel="noopener"><div class="pbtn">▶</div><div><div class="vtitle">${displayTitle}</div><div style="font-size:11px;color:var(--gold);margin-top:4px">📺 Tap to watch on YouTube</div></div></a>`;
 }else{
  h+=`<div style="padding:14px;text-align:center;color:var(--dim);font-size:13px">No video assigned. Add a YouTube link below.</div>`;
 }
 h+=`<div class="note-add" style="border-top:1px solid rgba(201,168,76,0.15)">
  <div style="font-size:12px;color:var(--gold);margin-bottom:6px;font-weight:500">✏️ Change YouTube link:</div>
  <input type="url" id="vid-input-${t.id}" placeholder="https://www.youtube.com/watch?v=..." value="${displayUrl}" style="width:100%;background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:8px 10px;font-size:13px;color:var(--cream);font-family:inherit;outline:none;box-sizing:border-box">
  <div style="display:flex;gap:8px;margin-top:8px">
   <button class="note-add-btn" style="flex:1" onclick="saveTourVideo('${t.id}')">💾 Save</button>
   <button class="note-add-btn" style="flex:0.6;background:rgba(255,80,80,0.08);border-color:rgba(255,80,80,0.35);color:#ff6464" onclick="deleteTourVideo('${t.id}')">🗑 Delete</button>
  </div>
 </div></div>`;
 return h;
}
function saveTourVideo(tid){
 const inp=document.getElementById('vid-input-'+tid);
 if(!inp)return;
 const url=inp.value.trim();
 if(url&&!url.includes('youtube')&&!url.includes('youtu.be'))return alert('Please enter a valid YouTube link');
 if(url)localStorage.setItem('tourvid_'+tid,url);
 renderTourBody();
}
function deleteTourVideo(tid){
 if(!confirm('Delete the video link?'))return;
 localStorage.removeItem('tourvid_'+tid);
 renderTourBody();
}


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
 // Use real-time rates if available
 const liveEUR=window._EUR||EUR;
 const livePLN=window._PLN||PLN;
 const liveCZK=window._CZK||CZK;
 const liveMXN=window._MXN||MXN_USD;
 const fxTs=parseInt(localStorage.getItem('fx_ts')||'0');
 const fxAge=fxTs?Math.round((Date.now()-fxTs)/60000):null;
 const fxLabel=fxTs?(fxAge<1?'just now':fxAge<60?` ${fxAge} min ago`:` ${Math.round(fxAge/60)}h`):'fixed (offline)';
 const isLive=fxTs&&fxAge<120;
 document.getElementById('monedas-card').innerHTML=`
  <div style="padding:8px 14px;font-size:11px;color:${isLive?'#5ecb7a':'#ffa552'};background:${isLive?'rgba(94,203,122,0.06)':'rgba(255,165,82,0.06)'};border-bottom:1px solid var(--border);display:flex;align-items:center;gap:6px">
   ${isLive?'🔄':'📴'} Exchange rate updated ${fxLabel} · ${isLive?'in real time':'offline, using last saved data'}
   ${isLive?'':`<button onclick="fetchExchangeRates().then(ok=>{if(ok)renderMonedas();})" style="margin-left:auto;background:transparent;border:1px solid #ffa552;color:#ffa552;padding:2px 8px;border-radius:4px;font-size:10px;cursor:pointer">🔄 Refresh</button>`}
  </div>
  <div class="curr-row"><div class="csym">€</div><div><div class="cname">Euro</div><div class="crate">$1 USD = ${(1/liveEUR).toFixed(3)} € · 1 € = $${liveEUR.toFixed(3)} USD</div><div class="cnote">🇳🇱🇩🇪🇫🇷🇧🇪🇱🇺 Netherlands, Germany, France, Belgium, Luxembourg</div></div></div>
  <div class="curr-row"><div class="csym">zł</div><div><div class="cname">Polish Złoty (PLN)</div><div class="crate">$1 USD = ${(1/livePLN).toFixed(2)} zł · 100 zł = $${(livePLN*100).toFixed(2)} USD</div><div class="cnote">🇵🇱 Poland (Warsaw & Kraków) · EU member but does NOT use the euro</div></div></div>
  <div class="curr-row"><div class="csym">Kč</div><div><div class="cname">Czech Koruna (CZK)</div><div class="crate">$1 USD = ${(1/liveCZK).toFixed(1)} Kč · 100 Kč = $${(liveCZK*100).toFixed(2)} USD</div><div class="cnote">🇨🇿 Czech Republic (Prague) · Did not adopt the euro</div></div></div>
  <div class="curr-row"><div class="csym" style="font-size:14px">$</div><div><div class="cname">Mexican Peso (MXN)</div><div class="crate">$1 USD = $${(1/liveMXN).toFixed(2)} MXN · $100 MXN = $${(liveMXN*100).toFixed(2)} USD</div><div class="cnote">🇲🇽 For reference when comparing costs to Mexico</div></div></div>`;
 // Update rates for calculator too
 
 calcUpdate();
 // Auto-refresh if has signal
 if(navigator.onLine&&(!fxTs||fxAge>25)){
  fetchExchangeRates().then(ok=>{if(ok)renderMonedas();});
 }
}
const USD_MXN=MXN_USD;
const ratesToUSD={USD:1,EUR:EUR,PLN:PLN,CZK:CZK,MXN:MXN_USD};
const currencyMeta={
 MXN:{flag:"🇲🇽",name:"Mexican Peso",sym:"$"},
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
 const inUSD=v*(window.ratesToUSD||{USD:1,EUR:EUR,PLN:PLN,CZK:CZK,MXN:MXN_USD})[from];
 const targets=['MXN','EUR','PLN','CZK','USD'].filter(c=>c!==from);
 out.innerHTML=targets.map(c=>{
  const result=inUSD/(window.ratesToUSD||{USD:1,EUR:EUR,PLN:PLN,CZK:CZK,MXN:MXN_USD})[c];
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
  full:`Check in at Mexico City International Airport 3 hours early for the transatlantic flight to Amsterdam. Overnight on board.`},
 {d:"2",wd:"Lun",dt:"7 Sep",c:"🇳🇱 Amsterdam",n:"Arrival · reception · panoramic city tour",tipo:"normal",
  full:`Arrival in Amsterdam, capital of the Kingdom of the Netherlands. Its historic center is a UNESCO World Heritage Site. After the panoramic city tour, reception and hotel transfer. Accommodation.`},
 {d:"3",wd:"Mar",dt:"8 Sep",c:"🇳🇱→🇩🇪 Amsterdam · Hanover · Berlin",n:"Breakfast · stop in Hanover · arrival Berlin",tipo:"normal",
  full:`Breakfast. We head to the city of Hanover in Germany, located on the banks of the Leine River "La Orilla Alta". Hanover was founded in medieval times by boatmen, fishermen and merchants. During our tour we visit the beautiful Opera House, the ruins of the Aegidienkirche, the Market Church, and the New and Old Town Halls. Then we continue to Berlin, capital of Germany. Accommodation.`},
 {d:"4",wd:"Mié",dt:"9 Sep",c:"🇩🇪 Berlin",n:"Panoramic tour · opt. Potsdam (Pkg.1)",tipo:"normal",
  full:`Breakfast. We take a panoramic tour of Berlin. Located on the banks of two rivers, the Spree and Havel which meet within the city, Berlin offers unforgettable views. Durante nuestro recorrido we visit Gendarmenmarkt Square, the Brandenburg Gate, Potsdamer Platz, Frauenkirche, el Zwinger Palace, the Brühl Terrace, el King's Way, the Martin Luther Statue y enjoy the majestic beauty of this ancient city. Accommodation.`,
  opcionales:["Ciudad de Potsdam"]},
 {d:"5",wd:"Jue",dt:"10 Sep",c:"🇩🇪→🇵🇱 Berlin · Warsaw",n:"Breakfast · journey · UNESCO Old Town tour",tipo:"normal",
  full:`Breakfast. We head to Warsaw, capital of Poland. Its Old Town — a UNESCO World Heritage Site — was completely rebuilt after WWII. During our tour we visit the Royal Castle, the famous Sigismund Column, and the Church of the Visitationists. Accommodation.`},
 {d:"6",wd:"Vie",dt:"11 Sep",c:"🇵🇱 Warsaw → Kraków",n:"Breakfast · journey · Kraków panoramic tour",tipo:"normal",
  full:`Breakfast. We head to the Polish city of Kraków. Another beautiful European city with its historic center on the UNESCO World Heritage List. During our panoramic tour we visit Wawel Castle, the incredible Basilica of Saints Stanislaus and Wenceslaus with its numerous chapels of different periods and architectural styles, St. Mary's Basilica, the Renaissance Cloth Hall, the Main Market Square y the small Church of St. Adalbert. Accommodation.`},
 {d:"7",wd:"Sáb",dt:"12 Sep",c:"🇵🇱 Kraków ★ FREE DAY",n:"Opt. Auschwitz (Pkg.1) · Wieliczka (Pkg.2) · or personal tour",tipo:"libre",
  full:`Breakfast. Free day for personal activities or an optional excursion. Accommodation.`,
  opcionales:["Campo de concentración de Auschwitz–Birkenau","Wieliczka Salt Mine"]},
 {d:"8",wd:"Dom",dt:"13 Sep",c:"🇵🇱→🇨🇿 Kraków · Prague",n:"Breakfast · journey · Prague panoramic tour",tipo:"normal",
  full:`Breakfast. We head to Prague, capital of the Czech Republic and historic capital of Bohemia. Built in the 9th century on the banks of the Vltava River, by the 17th-19th century it became so splendid that all of Europe called it Golden Prague. On our panoramic city tour we pass through Wenceslas Square, one of Prague's largest, then reach the Old Town Square, located between Wenceslas Square and Charles Bridge (Karluv Most). On the Old Town Square we see the Astronomical Clock Tower, the Týn Church, the Old Town Hall, St. Nicholas Church and the Jan Hus Monument. After lunch we continue to the other bank of Prague. We pass Charles Bridge, built in the 14th century. Accommodation.`},
 {d:"9",wd:"Lun",dt:"14 Sep",c:"🇨🇿 Prague ★ FREE DAY",n:"Opt. Barco Moldava (P1) · Karlovy Vary/Noche Checa (P2) · o personal",tipo:"libre",
  full:`Breakfast. Free day for personal activities or an optional excursion. Accommodation.`,
  opcionales:["Paseo en barco por el Río Moldava","Karlovy Vary Excursion","Czech evening with traditional dinner"]},
 {d:"10",wd:"Mar",dt:"15 Sep",c:"🇨🇿→🇩🇪 Prague · Nuremberg",n:"Breakfast · journey · Nuremberg city tour",tipo:"normal",
  full:`Breakfast. We head to the German city of Nuremberg. The magnificent Imperial Castle was built atop a hill about a thousand years ago. Over the following centuries this picturesque complex became the living core of a rapidly growing city. During our tour of Nuremberg we visit the impressive Church of Our Lady, the Opera House, the Old Town Hall and of course the fascinating views of the Pegnitz River. Accommodation.`},
 {d:"11",wd:"Mié",dt:"16 Sep",c:"🇩🇪 Nuremberg ★ FREE DAY",n:"Opt. Rothenburg (P1) · Munich (P2) · or personal tour",tipo:"libre",
  full:`Breakfast. Free day for personal activities or an optional excursion. Accommodation.`,
  opcionales:["Rothenburg ob der Tauber","Munich City"]},
 {d:"12",wd:"Jue",dt:"17 Sep",c:"🇩🇪 Nuremberg → Frankfurt",n:"Breakfast · journey · Frankfurt city visit",tipo:"normal",
  full:`Breakfast. We head to Frankfurt, located in central Germany on the banks of the Main River, an important global financial center. The city's origins date back to the early medieval period, always centered on the Römer hill. We visit the impressive Römer merchant buildings built in the 13th and 14th centuries, St. Nicholas Church, the Imperial Cathedral of St. Bartholomew y we enjoy the majestic silhouettes of the European Central Bank, the Bank of Germany y the Frankfurt Stock Exchange among the most important financial institutions in the world. Accommodation.`,
  opcionales:["Paseo nocturno en barco por el Río Meno"]},
 {d:"13",wd:"Vie",dt:"18 Sep",c:"🇩🇪→🇱🇺🇫🇷 Frankfurt · Luxembourg · Metz",n:"Breakfast · Luxembourg stop (opt.) · Metz base city",tipo:"normal",
  full:`Breakfast. We head to the French city of Metz or Thionville. Free time for optional excursions to Luxembourg City in the Grand Duchy of Luxembourg and to the city of Schengen. Accommodation.`,
  opcionales:["Luxembourg City","Schengen City"]},
 {d:"14",wd:"Sáb",dt:"19 Sep",c:"🇫🇷 Metz / Thionville ★ FREE DAY",n:"Opt. Luxemburgo/Estr./Colmar (P1) · Schengen (P2) · o Metz libre",tipo:"libre",
  full:`Breakfast. Free day for personal activities or an optional excursion. Accommodation.`,
  opcionales:["Ciudad de Strasbourg","Colmar City"]},
 {d:"15",wd:"Dom",dt:"20 Sep",c:"🇫🇷→🇧🇪 Metz · Brussels",n:"Breakfast · journey · Brussels tour",tipo:"normal",
  full:`Breakfast. We head to Brussels, capital of the Kingdom of Belgium, seat of the European Commission, famous for its beer and chocolate. We visit the impressive Grand Place, the Saint-Hubert Royal Galleries, the Manneken Pis sculpture, el Royal Palace de Bruselas, the Royal Museums of Fine Arts. Accommodation.`},
 {d:"16",wd:"Lun",dt:"21 Sep",c:"🇧🇪 Brussels ★ FREE DAY",n:"Opt. Bruges and Ghent (Pkg.1) · or Brussels on your own",tipo:"libre",
  full:`Breakfast. Free day for personal activities or an optional excursion. Accommodation.`,
  opcionales:["Bruges and Ghent"]},
 {d:"17",wd:"Mar",dt:"22 Sep",c:"🇧🇪→🇳🇱 Brussels · Amsterdam ⭐ PERSONAL TOUR",n:"No P2: free Amsterdam day → Rijksmuseum, Jordaan, canals",tipo:"tp",
  full:`Breakfast. We head to Amsterdam. Free time for personal activities or optional excursion. Accommodation.`,
  opcionales:["Volendam & Marken","The Hague","Giethoorn Village"]},
 {d:"18",wd:"Mié",dt:"23 Sep",c:"🇳🇱 Amsterdam → ✈️ Mexico City",n:"Breakfast · airport transfer · return flight",tipo:"normal",
  full:`Breakfast. At the indicated time, transfer to the airport for the return flight to Mexico City.`},
];
document.getElementById('quick-itinerary').innerHTML=itin.map((i,idx)=>{
 const opc=i.opcionales&&i.opcionales.length?`<div class="iexp-opc-title">Excursiones opcionales</div>`+i.opcionales.map(o=>`<div class="iexp-opc-item">◆ ${o}</div>`).join(''):'';
 return `<div class="irow" data-day="${idx}" id="irow-${idx}" role="button" tabindex="0">
  <div class="iday"><div class="idaynum">D${i.d}</div><div class="idaydate">${i.wd}<br>${i.dt}</div></div>
  <div style="flex:1;min ago-width:0">
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

document.getElementById('tp-home-box').innerHTML=`<div class="tph">5 opportunities identified in the itinerary</div>`+[
 {d:"Day 7 · Sat Sep 12",c:"Kraków",n:"Skip Auschwitz (P1) and Wieliczka (P2)? Kazimierz Quarter + Main Market Square at your own pace."},
 {d:"Day 9 · Mon Sep 14",c:"Prague",n:"No optional tours? Prague Castle on your own + Charles Bridge at sunrise."},
 {d:"Day 11 · Wed Sep 16",c:"Nuremberg",n:"No Rothenburg or Munich? Nuremberg Trials (Courtroom 600) + walkable medieval walls."},
 {d:"Day 14 · Sat Sep 19",c:"Metz",n:"No excursions? Saint-Étienne Cathedral + Centre Pompidou-Metz + Temple Quarter."},
 {d:"Day 17 · Tue Sep 22 ⭐",c:"Amsterdam (recommended)",n:"No P2? Amsterdam free for the Rijksmuseum, Jordaan neighborhood and canals at leisure."},
].map(t=>`<div class="tpi"><strong>${t.d} · ${t.c}</strong><br>${t.n}</div>`).join('');

// Initialize home documents
(async function initHomeDocs(){
 const docs=await getDocs('home');
 const counter=document.getElementById('doc-counter-home');
 const list=document.getElementById('doc-list-home');
 if(counter)counter.textContent=docs.length+' '+(docs.length===1?'document':'documents');
 if(list){
  if(docs.length===0){
   list.innerHTML='<div style="padding:14px;font-size:13px;color:var(--dim);text-align:center">No documents yet.<br>Tap the gold button to add travel PDFs.</div>';
  } else {
   list.innerHTML=docs.sort((a,b)=>b.ts-a.ts).map(d=>`
    <div class="doc-row" onclick="viewDoc(${d.id})">
     <div class="doc-icon">📄</div>
     <div style="flex:1;min ago-width:0">
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
   list.innerHTML='<div style="padding:14px;font-size:13px;color:var(--dim);text-align:center">No documents yet.</div>';
  } else {
   list.innerHTML=docs.sort((a,b)=>b.ts-a.ts).map(d=>`
    <div class="doc-row" onclick="viewDoc(${d.id})">
     <div class="doc-icon">📄</div>
     <div style="flex:1;min ago-width:0">
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

// ===== ONLINE / OFFLINE BADGE =====
function updateOnlineBadge(){
 const badge=document.getElementById('offline-badge');
 if(!badge)return;
 if(navigator.onLine){
  badge.style.display='none';
 } else {
  badge.style.display='flex';
 }
}
// Check on load
updateOnlineBadge();
// Listen for changes
window.addEventListener('online', ()=>{
 updateOnlineBadge();
 // Auto-refresh exchange rates when connection returns
 fetchExchangeRates().then(ok=>{
  if(ok&&document.getElementById('monedas-card'))renderMonedas();
 });
});
window.addEventListener('offline', updateOnlineBadge);
