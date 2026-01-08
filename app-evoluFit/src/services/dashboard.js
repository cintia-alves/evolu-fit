export const dashboardService = {
  getData: async () => {
    return new Promise((resolve) => {
      // Simulando delay de rede
      setTimeout(() => {
        const today = new Date();
        const currentDay = today.getDate();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        // Arrays auxiliares para formatação
        const weekDays = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];
        const months = [
          'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
          'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];

        // 1. Definir o texto "Mês, Ano"
        const currentDateString = `${months[currentMonth]}, ${currentYear}`;

        // 2. Calcular o Domingo desta semana (início da semana)
        // today.getDay() retorna 0 (Dom) a 6 (Sab). Subtraímos isso do dia atual.
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());

        // 3. Gerar o array da semana (Domingo a Sábado)
        const calendar = [];
        
        for (let i = 0; i < 7; i++) {
          const tempDate = new Date(startOfWeek);
          tempDate.setDate(startOfWeek.getDate() + i);

          // Verifica se é o dia de hoje para marcar como active: true
          const isActive = 
            tempDate.getDate() === currentDay &&
            tempDate.getMonth() === currentMonth &&
            tempDate.getFullYear() === currentYear;

          calendar.push({
            day: weekDays[i],
            date: tempDate.getDate().toString().padStart(2, '0'), // Garante "01" em vez de "1"
            active: isActive
          });
        }

        resolve({
          user: { name: 'Cíntia' },
          currentDate: currentDateString, // Agora é dinâmico
          calendar: calendar // Agora é real
        });
      }, 500);
    });
  }
};