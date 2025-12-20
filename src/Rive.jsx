import { useRive } from '@rive-app/react-canvas';
import { useEffect } from 'react';
import styles from './Rive.module.css';

export default function Rive() {
  const { rive, RiveComponent } = useRive({
    src: '/animation/boy.riv',  
    stateMachines: ['leaves', 'blink','swinging'],
    autoplay: true,
  });

  useEffect(() => {
    if (rive) {
      // Stop the blink state machine on mount
      rive.stop('blink');
    }
  }, [rive]);

  const handleMouseEnter = () => {
    if (rive) {
      // Stop first to reset, then play
      rive.stop('blink');
      rive.play('blink');
    }
  };

  const handleMouseLeave = () => {
    if (rive) {
      // Stop instead of pause to reset the state machine
      rive.stop('blink');
    }
  };

  return (
    <div className={styles.container}>
      <RiveComponent
        className={styles.animation}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
    </div>
  );
}