// RoleUtils.js
export const getCurrentUserRole = () => {
    return localStorage.getItem('role');
  };
  
  export const isAdmin = () => {
    return getCurrentUserRole() === 'ADMIN';
  };
  
  export const isHdfc = () => {
    return getCurrentUserRole() === 'HDFC';
  };
  
  export const isIcici = () => {
    return getCurrentUserRole() === 'ICICI';
  };
  
  export const isMis = () => {
    return getCurrentUserRole() === 'MIS';
  };
  export const isUser = () => {
    return getCurrentUserRole() === 'MIS';
  };
  