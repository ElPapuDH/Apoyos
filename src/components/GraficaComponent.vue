<template>
  <div class="container mt-4">
    <div class="d-flex flex-column flex-md-row align-items-start mb-3">
      <div class="me-2">
        <label for="sessionFilter" class="form-label">Filtrar por Sección:</label>
        <select v-model="selectedSession" id="sessionFilter" class="form-select">
          <option value="">Todas</option>
          <option v-for="session in uniqueSessions" :key="session" :value="session">
            {{ session }}
          </option>
        </select>
      </div>

      <div>
        <label for="monthFilter" class="form-label">Filtrar por Mes:</label>
        <select v-model="selectedMonth" id="monthFilter" class="form-select">
          <option value="">Todos</option>
          <option v-for="month in uniqueMonths" :key="month" :value="month">
            {{ month }}
          </option>
        </select>
      </div>
    </div>

    <!-- Gráfica -->
    <canvas ref="chartRef" id="myChart" class="w-100"></canvas>

    <div class="d-flex justify-content-between mt-4">
      <button @click="goToPerfil" class="button-perfil">
        Volver al Perfil
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue';
import { Chart, registerables } from 'chart.js';
import { useRouter } from 'vue-router';

Chart.register(...registerables);

export default {
  name: 'GraficaComponent',
  setup() {
    const router = useRouter();
    const chartRef = ref(null);
    const selectedSession = ref('');
    const selectedMonth = ref('');
    const gastos = ref([]);
    let chartInstance = null;

    const fetchGastos = async () => {
      try {
        const response = await fetch('http://localhost:3030/api/gastos');
        if (!response.ok) throw new Error('Error al obtener los datos de gastos.');
        gastos.value = await response.json();
      } catch (error) {
        console.error('Error fetching gastos:', error);
      }
    };

    const getMonthName = (dateString) => {
      const [year, month] = dateString.split('-');
      const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ];
      return `${months[parseInt(month) - 1]}-${year}`;
    };

    const sortMonths = (a, b) => {
      const [monthA, yearA] = a.split('-');
      const [monthB, yearB] = b.split('-');
      const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      if (yearA !== yearB) return parseInt(yearA) - parseInt(yearB);
      return months.indexOf(monthA) - months.indexOf(monthB);
    };

    const getColorForAmount = (amount, maxAmount) => {
      const ratio = amount / maxAmount;
      if (ratio > 0.66) return 'rgba(75, 192, 192, 0.8)';
      if (ratio > 0.33) return 'rgba(255, 206, 86, 0.8)';
      return 'rgba(255, 99, 132, 0.8)';
    };

    const createChart = () => {
      if (chartInstance) chartInstance.destroy();

      const filteredGastos = gastos.value.filter(gasto => {
        const matchesSession = selectedSession.value ? gasto.Seccion === selectedSession.value : true;
        const matchesMonth = selectedMonth.value ? getMonthName(gasto.Mes) === selectedMonth.value : true;
        return matchesSession && matchesMonth;
      });

      if (!filteredGastos.length) return console.warn('No hay datos de gastos para mostrar con los filtros actuales.');

      const labels = [...new Set(filteredGastos.map(gasto => getMonthName(gasto.Mes)))].sort(sortMonths);
      const datasets = {};
      const maxAmount = Math.max(...filteredGastos.map(gasto => gasto.Total));

      filteredGastos.forEach(({ Seccion, Total, Mes }) => {
        const monthName = getMonthName(Mes);
        if (!datasets[Seccion]) {
          datasets[Seccion] = {
            label: `Sección ${Seccion}`,
            data: {},
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1,
          };
        }
        datasets[Seccion].data[monthName] = (datasets[Seccion].data[monthName] || 0) + Total;
      });

      const chartData = {
        labels: labels,
        datasets: Object.values(datasets).map(dataset => {
          const data = labels.map(month => dataset.data[month] || 0);
          return {
            ...dataset,
            data: data,
            backgroundColor: data.map(amount => getColorForAmount(amount, maxAmount)),
            borderColor: data.map(amount => getColorForAmount(amount, maxAmount).replace('0.8', '1')),
          };
        }),
      };

      const ctx = chartRef.value.getContext('2d');
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { title: { display: true, text: 'Mes' } },
            y: { title: { display: true, text: 'Monto' } },
          },
          plugins: {
            tooltip: {
              callbacks: {
                title: tooltipItems => tooltipItems[0].label,
                label: context => {
                  const sectionName = context.dataset.label.replace('Sección ', '');
                  const amount = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(context.parsed.y);
                  return `Sección: ${sectionName}, Monto: ${amount}`;
                },
              },
            },
            legend: { position: 'top' },
            title: { display: true, text: 'Gastos por Sección y Mes' },
          },
        },
      });
    };

    onMounted(async () => {
      await fetchGastos();
      createChart();
    });

    const uniqueSessions = computed(() => Array.from(new Set(gastos.value.map(gasto => gasto.Seccion))));
    const uniqueMonths = computed(() => {
      const months = new Set(gastos.value.map(gasto => getMonthName(gasto.Mes)));
      return Array.from(months).sort(sortMonths);
    });

    watch([selectedSession, selectedMonth], createChart);

    const goToPerfil = () => router.push('/perfil');

    return {
      chartRef,
      selectedSession,
      selectedMonth,
      uniqueSessions,
      uniqueMonths,
      getMonthName,
      goToPerfil,
    };
  },
};
</script>

<style>
canvas {
  width: 100% !important;
  height: auto !important;
  max-height: 400px;
}

.filters {
  margin-bottom: 20px;
}

.button-perfil {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.button-perfil:hover {
  background-color: #45a049;
}
</style>
