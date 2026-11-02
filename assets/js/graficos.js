/* Gráficos del blog — Chart.js 4 (incluido en assets/vendor).
   Para cambiar un dato, edita los arreglos "data" de cada gráfico. */
(function () {
  if (typeof Chart === "undefined") return;

  const C = {
    campo: "#2f6a4f",
    ciudad: "#3d5f93",
    nacional: "#d99a1e",
    tierra: "#9a4a2a",
    gris: "#6b655c",
    linea: "#e8dfd1"
  };

  Chart.defaults.font.family = '"Inter", system-ui, sans-serif';
  Chart.defaults.font.size = 13;
  Chart.defaults.color = C.gris;
  Chart.defaults.plugins.legend.display = false;
  Chart.defaults.plugins.tooltip.backgroundColor = "#23201b";
  Chart.defaults.plugins.tooltip.padding = 10;
  Chart.defaults.plugins.tooltip.cornerRadius = 8;
  Chart.defaults.maintainAspectRatio = false;
  Chart.defaults.animation.duration = 900;

  const pct = (v) => v.toLocaleString("es-CO", { maximumFractionDigits: 1 }) + "%";
  const ejePct = (max) => ({
    beginAtZero: true,
    max: max,
    grid: { color: C.linea },
    border: { display: false },
    ticks: { callback: (v) => v + "%" }
  });
  const sinGrid = { grid: { display: false }, border: { display: false } };

  /* Etiquetas de valor encima/al lado de las barras */
  const etiquetas = {
    id: "etiquetas",
    afterDatasetsDraw(chart, _args, opts) {
      if (!opts || !opts.mostrar) return;
      const { ctx } = chart;
      ctx.save();
      ctx.font = '700 12px "Inter", system-ui, sans-serif';
      chart.data.datasets.forEach((ds, i) => {
        const meta = chart.getDatasetMeta(i);
        if (meta.hidden) return;
        meta.data.forEach((el, j) => {
          const v = ds.data[j];
          ctx.fillStyle = "#23201b";
          if (chart.options.indexAxis === "y") {
            ctx.textAlign = "left"; ctx.textBaseline = "middle";
            ctx.fillText(pct(v), el.x + 6, el.y);
          } else {
            ctx.textAlign = "center"; ctx.textBaseline = "bottom";
            ctx.fillText(pct(v), el.x, el.y - 4);
          }
        });
      });
      ctx.restore();
    }
  };
  Chart.register(etiquetas);

  const crear = (id, config) => {
    const el = document.getElementById(id);
    if (el) new Chart(el, config);
  };

  /* ---------- ENTRADA 1 ---------- */

  // Informalidad laboral, trimestre móvil junio–agosto (DANE, GEIH)
  crear("g-informalidad", {
    type: "line",
    data: {
      labels: ["2021", "2022", "2023", "2024", "2025", "2026"],
      datasets: [
        { label: "Campo (centros poblados y rural disperso)", data: [86.9, 84.4, 83.3, 84.1, 83.0, 83.1], borderColor: C.campo, backgroundColor: C.campo },
        { label: "Total nacional", data: [59.7, 57.9, 56.0, 56.0, 55.2, 54.8], borderColor: C.nacional, backgroundColor: C.nacional },
        { label: "13 ciudades principales", data: [45.0, 43.4, 41.4, 41.8, 41.9, 40.7], borderColor: C.ciudad, backgroundColor: C.ciudad }
      ].map((d) => ({ ...d, borderWidth: 3, tension: .3, pointRadius: 4, pointHoverRadius: 6 }))
    },
    options: {
      interaction: { mode: "index", intersect: false },
      plugins: { tooltip: { callbacks: { label: (c) => " " + c.dataset.label + ": " + pct(c.raw) } } },
      scales: { y: ejePct(100), x: sinGrid }
    }
  });

  // Motivo para crear el micronegocio (DANE, EMICRON 2024)
  crear("g-motivo", {
    type: "bar",
    data: {
      labels: ["Total nacional", "Ciudades y cabeceras", "Campo"],
      datasets: [
        { label: "No tenía otra alternativa de ingresos", data: [36.1, 34.3, 40.2], backgroundColor: C.tierra, borderRadius: 6 },
        { label: "Vio una oportunidad de negocio", data: [31.0, 34.6, 23.0], backgroundColor: C.nacional, borderRadius: 6 }
      ]
    },
    options: {
      plugins: { etiquetas: { mostrar: true }, tooltip: { callbacks: { label: (c) => " " + c.dataset.label + ": " + pct(c.raw) } } },
      scales: { y: ejePct(50), x: sinGrid }
    }
  });

  // Supervivencia a 5 años por tamaño (Confecámaras, 2023)
  crear("g-supervivencia", {
    type: "bar",
    data: {
      labels: ["Microempresas", "Pequeñas", "Medianas", "Grandes"],
      datasets: [{ data: [33.4, 60.9, 73.7, 85.7], backgroundColor: [C.tierra, C.nacional, "#7fa88a", C.campo], borderRadius: 6 }]
    },
    options: {
      indexAxis: "y",
      plugins: { etiquetas: { mostrar: true }, tooltip: { callbacks: { label: (c) => " Siguen vivas a 5 años: " + pct(c.raw) } } },
      scales: { x: ejePct(100), y: sinGrid }
    }
  });

  /* ---------- ENTRADA 2 ---------- */

  // Brecha campo–ciudad (DANE: pobreza 2025, IPM 2025, GEIH jun–ago 2026)
  crear("g-brecha", {
    type: "bar",
    data: {
      labels: ["Pobreza monetaria", "Pobreza extrema", "Pobreza multidimensional", "Informalidad laboral"],
      datasets: [
        { label: "Ciudad", data: [24.6, 6.9, 6.3, 40.7], backgroundColor: C.ciudad, borderRadius: 6 },
        { label: "Campo", data: [39.5, 19.1, 22.4, 83.1], backgroundColor: C.campo, borderRadius: 6 }
      ]
    },
    options: {
      plugins: { etiquetas: { mostrar: true }, tooltip: { callbacks: { label: (c) => " " + c.dataset.label + ": " + pct(c.raw) } } },
      scales: { y: ejePct(100), x: sinGrid }
    }
  });

  // ¿Dónde viven las personas pobres? (DANE, pobreza monetaria 2025, miles de personas)
  crear("g-pobres", {
    type: "doughnut",
    data: {
      labels: ["Ciudades y cabeceras", "Campo"],
      datasets: [{ data: [9798, 4649], backgroundColor: [C.ciudad, C.campo], borderWidth: 0, hoverOffset: 8 }]
    },
    options: {
      cutout: "62%",
      plugins: {
        legend: { display: true, position: "bottom", labels: { usePointStyle: true, padding: 16 } },
        tooltip: { callbacks: { label: (c) => " " + c.label + ": " + (c.raw / 1000).toLocaleString("es-CO", { maximumFractionDigits: 1 }) + " millones de personas" } }
      }
    }
  });
})();
