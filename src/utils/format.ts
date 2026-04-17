import i18n from '../i18n';

export const formatCurrency = (amount: number) => {
  const isArabic = i18n.language === 'ar';
  
  // EGP layout in Arabic: 100 ج.م
  if (isArabic) {
    return `${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} ج.م`;
  }
  
  // EGP layout in English: EGP 100.00
  return `EGP ${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
};
