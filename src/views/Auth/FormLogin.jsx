import { useState } from "react";
import {
  FormLayout,
  FormLayoutGroup,
  FormStatus,
  FormItem,
  Input,
  Button,
} from "@vkontakte/vkui";
import { useDispatch, useSelector } from "react-redux";
import { postLogin } from "../../store/reducers/userSlice";
import { Link } from "react-router-dom";

const FormLogin = ({ setActivePanel }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isValid, setIsValid] = useState(true);
  const resultLogin = useSelector((state) => state.user.resultLogin);
  const dispatch = useDispatch();

  const handlerSubmit = (e) => {
    e.preventDefault();

    if (formData.password.length < 8) {
      setIsValid(false);
    } else {
      dispatch(postLogin(formData));
    }
  };

  return (
    <FormLayout onSubmit={handlerSubmit}>
      {resultLogin.error !== "" && (
        <FormStatus header="Ошибка" mode="error">
          {resultLogin.error}
        </FormStatus>
      )}
      <FormLayoutGroup mode="vertical">
        <FormItem top="Имя пользователя" htmlFor="username">
          <Input
            id="username"
            type="text"
            onChange={(e) =>
              setFormData({
                ...formData,
                username: e.target.value,
              })
            }
            value={formData.login}
            autoFocus
          />
        </FormItem>
        <FormItem
          top="Пароль"
          htmlFor="password"
          status={!isValid && "error"}
          bottom={
            (!isValid ||
              (formData.password.length < 8 && formData.password !== "")) &&
            "Длина пароля должна быть больше 8 символов"
          }
        >
          <Input
            id="password"
            type="password"
            autoComplete="on"
            onChange={(e) =>
              setFormData({
                ...formData,
                password: e.target.value,
              })
            }
            value={formData.password}
          />
        </FormItem>
      </FormLayoutGroup>
      <FormLayoutGroup>
        <FormItem>
          <Button onClick={handlerSubmit} size="l" stretched>
            Войти
          </Button>
        </FormItem>
        <FormItem>
          <Link to="forgot" onClick={() => setActivePanel("forgot")}>
            <Button size="l" stretched appearance="neutral">
              Забыл пароль
            </Button>
          </Link>
        </FormItem>
      </FormLayoutGroup>
    </FormLayout>
  );
};

export default FormLogin;