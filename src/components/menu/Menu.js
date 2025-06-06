import { useState } from 'react';

function Menu({ menu }) {
  const [activeContent, setActiveContent] = useState(null);
  const [selectedButton, setSelectedButton] = useState(null);

  return (
    <>
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
    </>
  );
}

export default Menu;
