/* Mapa de contexto (Leaflet). Para agregar un punto, copia una línea del arreglo "puntos". */
(function () {
  const el = document.getElementById("mapa");
  if (!el || typeof L === "undefined") return;

  const mapa = L.map(el, { scrollWheelZoom: false }).setView([5.6, -74.4], 6);
  // Mapa base libre de OpenStreetMap (no requiere API key)
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(mapa);

  const colores = { iniciativa: "#2f6a4f", red: "#a2357a", dato: "#9a4a2a" };
  const icono = (tipo) => L.divIcon({
    className: "",
    html: `<span style="display:block;width:22px;height:22px;border-radius:50%;background:${colores[tipo]};border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.35)"></span>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11]
  });

  const puntos = [
    { tipo: "iniciativa", lat: 4.711, lng: -74.072, t: "Bogotá: Mercados Solidarios MD", d: "Plataforma de la Gerencia de Desarrollo Rural Sostenible del Minuto de Dios que vende a domicilio productos de familias campesinas, con menos intermediarios." },
    { tipo: "iniciativa", lat: 4.64, lng: -74.12, t: "Bogotá: Mercados Campesinos Bogotanos", d: "Estrategia distrital de venta directa: el Distrito proyecta más de 17.000 espacios de comercialización en dos años." },
    { tipo: "red", lat: 4.442, lng: -74.044, t: "Chipaque (Cundinamarca): Nubia e Hijos", d: "Familia campesina que llegó a YouTube en la pandemia para mostrar la vida del campo y salir adelante." },
    { tipo: "iniciativa", lat: 5.565, lng: -73.185, t: "Toca (Boyacá): Comproagro", d: "Plataforma web creada en el campo boyacense para que los productores vendan directamente, como una plaza de mercado en línea." },
    { tipo: "red", lat: 5.53, lng: -73.36, t: "Altiplano cundiboyacense: Soy Campesino", d: "Medio digital que viraliza campesinos y artesanos para que vendan sus cosechas sin intermediarios." },
    { tipo: "iniciativa", lat: 7.113, lng: -73.218, t: "Lebrija (Santander): «Piñatón»", d: "Campesinos que usaron las redes sociales para vender sus cosechas directamente en la ciudad durante la pandemia." },
    { tipo: "iniciativa", lat: 6.244, lng: -75.581, t: "Medellín: Mercados Campesinos", d: "Programa con más de tres décadas que conecta a familias de los corregimientos con compradores urbanos." },
    { tipo: "dato", lat: 5.694, lng: -76.661, t: "Quibdó (Chocó)", d: "La ciudad con mayor pobreza monetaria del país en 2025: 61,7% de sus habitantes (DANE)." },
    { tipo: "dato", lat: 9.305, lng: -75.397, t: "Sincelejo (Sucre)", d: "La capital con mayor informalidad laboral del país en 2026 (alrededor de 65%, DANE)." }
  ];

  puntos.forEach((p) => {
    L.marker([p.lat, p.lng], { icon: icono(p.tipo) })
      .addTo(mapa)
      .bindPopup(`<b>${p.t}</b><br>${p.d}`);
  });
})();
