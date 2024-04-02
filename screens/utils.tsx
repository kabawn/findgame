// utils.js
export const propertyKeyToLabel = (key) => {
    const labels = {
      availability: "Disponibilité",
      languages: "Langues parlées",
      phone: "Téléphone",
      yearsOfExperience: "Années d'expérience",
      email: "Email",
    };
  
    return labels[key] || key;
  };
  