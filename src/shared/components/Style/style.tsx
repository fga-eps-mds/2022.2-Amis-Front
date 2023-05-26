import styled from 'styled-components';

const getContainerStyles = () => {
  return styled.div`
    width: 100%;
    height: 100vh;
    background: ${(props) => props.theme.colors.grey};
    display: inline-flex;
  `;
};

const getContentStyles = () => {
  return styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  `;
};

const getDivButtonsStyles = () => {
  return styled.div`
    width: 85%;
    display: inline-flex;
    justify-content: flex-end;
    gap: 20px;
    margin: 0 auto;
    padding-top: 30px;
  `;
};

const getFormStyles = () => {
  return styled.form`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;
  `;
};

const getFormTextStyles = () => {
  return styled.h1`
    color: #525252;
    font-size: 18px;
    font-weight: 400;
    text-align: left;
    padding-bottom: 25px;
  `;
};

const getInlineStyles = () => {
  return {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",
    border: "none",
    boxShadow: 24,
    p: 4,
    padding: "50px",
    height: "85%",
    overflow: "hidden",
    overflowY: "scroll",
  };
};

export {
  getContainerStyles,
  getContentStyles,
  getDivButtonsStyles,
  getFormStyles,
  getFormTextStyles,
  getInlineStyles,
};
