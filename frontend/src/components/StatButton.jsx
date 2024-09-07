import { useState } from "react";
import { Typography} from '@mui/material';
import '../pages/stile/style.css';


function StatButton({ title, icon, value, description }) {
    const [clicked, setClicked] = useState(false);
  
    const handleClick = () => {
      setClicked(!clicked);
    };
  
    return (
      <div
        className={`stat-card ${clicked ? 'clicked' : ''}`}
        onClick={handleClick}
      >
        <div className="icon">
          {icon}
        </div>
        <div className="content">
          <Typography variant="h5">{title}</Typography>
          <Typography className="value">{value}</Typography>
          <Typography className="description">{description}</Typography>
        </div>
        <div className="line-graph"></div>
      </div>
    );
  }
  
  export default StatButton;