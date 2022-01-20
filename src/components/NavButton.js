import Link from "next/link";
import { useRouter, withRouter } from "next/router";

const NavButton = props => {
  const router = useRouter()
  return (
    <Link href={props.path}>
      <a style={{textDecoration: 'none', color: 'inherit'}}>
        { router.pathname === props.path ?
          <div
            style={{ color: "#8854D0" }}
          >
            <span className="Label">{props.label}</span>
          </div> :
          <div>
            <span className="Label">{props.label}</span>
          </div>
        }
      </a>
    </Link>
  );
};

export default withRouter(NavButton);
