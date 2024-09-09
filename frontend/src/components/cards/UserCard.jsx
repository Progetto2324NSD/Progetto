import React from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import FaceRoundedIcon from '@mui/icons-material/FaceRounded';
import '../../pages/stile/style.css';

function UserCard({ name }) {
    return (
      <Card className="text-center">
        <CardContent>
          <div className="user-avatar mb-3">
            <FaceRoundedIcon fontSize="large" />
          </div>
          <Typography variant="h6">
            {name}
          </Typography>
        </CardContent>
      </Card>
    );
}

export default UserCard;