import React from "react";

type LoaderWrapperProps = {
  loading: boolean;
  children: React.ReactNode;
};

const overlayStyle: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(255,255,255,0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};

const spinnerStyle: React.CSSProperties = {
  width: 48,
  height: 48,
  border: "6px solid #ccc",
  borderTop: "6px solid var(--primary-color, #003d14)",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
};

const wrapperStyle: React.CSSProperties = {
  position: "relative",
};

const LoaderWrapper: React.FC<LoaderWrapperProps> = ({ loading, children }) => (
  <div style={wrapperStyle}>
    {children}
    {loading && (
      <div style={overlayStyle}>
        <div style={spinnerStyle} />
        <style>
          {`
                        @keyframes spin {
                            0% { transform: rotate(0deg);}
                            100% { transform: rotate(360deg);}
                        }
                    `}
        </style>
      </div>
    )}
  </div>
);

export default LoaderWrapper;
