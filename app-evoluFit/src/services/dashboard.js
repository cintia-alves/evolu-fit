export const dashboardService = {
  getData: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          user: { name: 'Cíntia' },
          currentDate: 'Novembro, 2025',
          calendar: [
            { day: 'DOM', date: '26', active: false },
            { day: 'SEG', date: '27', active: false },
            { day: 'TER', date: '28', active: true }, // Dia ativo
            { day: 'QUA', date: '29', active: false },
            { day: 'QUI', date: '30', active: false },
            { day: 'SEX', date: '31', active: false },
          ]
        });
      }, 1000);
    });
  }
};