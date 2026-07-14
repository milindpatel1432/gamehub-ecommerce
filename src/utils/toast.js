import toast from 'react-hot-toast';

const toastStyle = {
  style: {
    background: '#121826', // bg-gaming-card equivalent
    border: '1px solid #1e293b', // border-gaming-border equivalent
    color: '#f8fafc', // text-slate-50 equivalent
    fontSize: '12px',
    fontWeight: 'bold',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    borderRadius: '12px',
    padding: '12px 16px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 15px rgba(0, 229, 255, 0.1)',
  },
};

export const successToast = (message) => {
  toast.success(message, {
    ...toastStyle,
    iconTheme: {
      primary: '#00e5ff', // gaming-cyan
      secondary: '#121826',
    },
  });
};

export const errorToast = (message) => {
  toast.error(message, {
    ...toastStyle,
    iconTheme: {
      primary: '#ef4444', // red-500
      secondary: '#121826',
    },
  });
};

export const infoToast = (message) => {
  toast(message, {
    ...toastStyle,
    icon: 'ℹ️',
  });
};

export const warningToast = (message) => {
  toast(message, {
    ...toastStyle,
    icon: '⚠️',
  });
};
