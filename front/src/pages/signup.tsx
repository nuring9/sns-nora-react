import { useEffect } from "react";
import routes from "../routes";
import { useLocation } from "react-router-dom";
import { InputGroup, Form } from "react-bootstrap";

import NavbarLayout from "../components/NavbarLayout";

export default function Signup() {
  const location = useLocation(); // 현재 페이지 location

  const title = process.env.REACT_APP_APP_TITLE; // 메인 타이틀
  useEffect(() => {
    const route = routes.find((p) => p.path === location.pathname);
    if (route) {
      const { title: subTitle } = route;
      document.title = title + " - " + subTitle;
    }
  }, [location.pathname, title]);

  return (
    <div>
      <NavbarLayout />

      <Form>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="name@example.com" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label>Example textarea</Form.Label>
          <Form.Control as="textarea" rows={3} />
        </Form.Group>
      </Form>
    </div>
  );
}
