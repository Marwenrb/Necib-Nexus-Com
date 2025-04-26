// Backup of loading indicators from Contact page

// Loading indicator component for submit button
const LoadingIndicator = () => (
  <span className="loadingIndicator">
    <span className="loadingDot"></span>
    <span className="loadingDot"></span>
    <span className="loadingDot"></span>
  </span>
);

// CSS for loading indicators
/*
.loadingIndicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
}

.loadingDot {
  width: 8px;
  height: 8px;
  background: #fff;
  border-radius: 50%;
  animation: loadingPulse 1.4s infinite ease-in-out;
  
  &:nth-child(1) {
    animation-delay: 0s;
  }
  
  &:nth-child(2) {
    animation-delay: 0.2s;
  }
  
  &:nth-child(3) {
    animation-delay: 0.4s;
  }
}

@keyframes loadingPulse {
  0%, 100% {
    transform: scale(0.5);
    opacity: 0.5;
  }
  50% {
    transform: scale(1);
    opacity: 1;
  }
}
*/

export default LoadingIndicator; 