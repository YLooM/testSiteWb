import { Link } from "react-router-dom";

import Avatar from "../UIElements/Avatar";
import Card from "../UIElements/Card";
import "./UserItem.css";

const UserItem = (props) => {
  return (
    <li className="user-item">
      <Card className="user-item__content">
        <Link to={`/${props.id}/tasks`}>
          <div className="user-item__image">
            <Avatar image={props.image} alt={props.name} />
          </div>
          <div className="user-item__info">
            <h2>{props.name}</h2>
            <h3></h3>
          </div>
        </Link>
      </Card>
    </li>
  );
};

export default UserItem;
