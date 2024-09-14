//Icone MUI
import { Typography } from '@mui/material';

// Stile
import '../pages/stile/style.css';

//Import React
import { Row, Col } from 'react-bootstrap';

function StatButton({ title, icon, value, description, isSelected, onClick }) {
  return (
    <div
      className={`stat-card ${isSelected ? 'clicked' : ''}`}
      onClick={onClick}
    >
    <Row>
      <Col>
        <div className="content">
          <Typography variant="h5">{title}</Typography>
          <Typography className="value">{value}</Typography>
        </div>
      </Col>
      <Col>
        <div className="icon">
          {icon}
        </div>
      </Col>
      <Typography className="description">{description}</Typography>
      <div className="line-graph"></div>
    </Row>


    </div>
  );
}

export default StatButton;
