import React, { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';

const MultiSpringComponent = () => {
  const [toggle, setToggle] = useState(false);

  // 第一个 spring 动画，控制位置
  const positionSpring = useSpring({
    x: toggle ? 100 : 0,
    y: toggle ? 100 : 0,
    config: { tension: 200, friction: 10 },
  });

  // 第二个 spring 动画，控制缩放
  const scaleSpring = useSpring({
    scale: toggle ? 2 : 1,
    config: { tension: 200, friction: 10 },
  });

  // 第三个 spring 动画，控制旋转
  const rotateSpring = useSpring({
    rotate: toggle ? 45 : 0,
    config: { tension: 200, friction: 10 },
  });

  return (
    <div>
      <button onClick={() => setToggle(!toggle)}>Toggle Animation</button>
      <animated.div
        style={{
          transform: positionSpring.x
            .to((x) => `translate(${x}px, ${positionSpring.y.get()}px)`)
            .concat(scaleSpring.scale.to((s) => ` scale(${s})`))
            .concat(rotateSpring.rotate.to((r) => ` rotate(${r}deg)`)),
          width: '100px',
          height: '100px',
          backgroundColor: 'lightblue',
        }}
      />
    </div>
  );
};

export default MultiSpringComponent;