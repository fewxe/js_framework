import React, { useState } from 'react';

function Menu({ menu }) {
  const [activeContent, setActiveContent] = useState(null);
  const [selectedButton, setSelectedButton] = useState(null);

  return (
    <div>
      {menu
        .filter(item => item.name !== selectedButton)
        .map(item => (
          <button
            key={item.name}
            onClick={() => {
              setActiveContent(item.component);
              setSelectedButton(item.name);
            }}
          >
            {item.name}
          </button>
        ))}
      <div>
        {activeContent}
      </div>
    </div>
  );
}

export default Menu;
