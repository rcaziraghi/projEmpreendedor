import React, { useState, useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { Router, Switch, Route, Link } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Login from "./components/Login";
import Registrar from "./components/Registrar";
import Home from "./components/Home";
import Perfil from "./components/Perfil";
import TelaUsuario from "./components/TelaUsuario";
import TelaMod from "./components/TelaMod";
import TelaAdmin from "./components/TelaAdmin";
import RecuperarSenha from "./components/RecuperarSenha";

import { logout } from "./actions/auth";
import { limparMensagem } from "./actions/mensagem";

import { historico } from "./helpers/historico";

import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import rootReducer from "./reducers";


const AppWrapper = () => {

const middleware = [thunk];

const store = createStore(
    rootReducer,
  composeWithDevTools(applyMiddleware(...middleware))
);

  return (
    <Provider store={store}>
      <App />
    </Provider>
  )
}

const App = () => {
  const [mostrarTelaMod, setMostrarTelaMod] = useState(false);
  const [mostrarTelaAdmin, setMostrarTelaAdmin] = useState(false);

  const { usuario: usuarioAtual } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    historico.listen((location) => {
      dispatch(limparMensagem()); // Limpa mensagem quando trocar localização
    });
  }, [dispatch]);

  useEffect(() => {
    if (usuarioAtual) {
      setMostrarTelaMod(usuarioAtual.cargos.includes("CARGO_MODERADOR"));
      setMostrarTelaAdmin(usuarioAtual.cargos.includes("CARGO_ADMIN"));
    }
  }, [usuarioAtual]);

  const logOut = () => {
    dispatch(logout());
  };

  return (
    <Router history={historico}>
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <Link to={"/"} className="navbar-brand">
            WaterStuff
          </Link>
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/home"} className="nav-link">
                Home
              </Link>
            </li>

            {mostrarTelaMod && (
              <li className="nav-item">
                <Link to={"/mod"} className="nav-link">
                  Moderação
                </Link>
              </li>
            )}

            {mostrarTelaAdmin && (
              <li className="nav-item">
                <Link to={"/admin"} className="nav-link">
                  Administração
                </Link>
              </li>
            )}

            {usuarioAtual && (
              <li className="nav-item">
                <Link to={"/usuario"} className="nav-link">
                  Seus serviços
                </Link>
              </li>
            )}
          </div>

          {usuarioAtual ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/perfil"} className="nav-link">
                  {usuarioAtual.email}
                </Link>
              </li>
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={logOut}>
                  LogOut
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Login
                </Link>
              </li>

              <li className="nav-item">
                <Link to={"/registrar"} className="nav-link">
                  Registrar
                </Link>
              </li>
            </div>
          )}
        </nav>

        <div className="container mt-3">
          <Switch>
            <Route exact path={["/", "/home"]} component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/registrar" component={Registrar} />
            <Route exact path="/perfil" component={Perfil} />
            <Route exact path="/recuperar/senha" component={RecuperarSenha} />
            <Route path="/usuario" component={TelaUsuario} />
            <Route path="/mod" component={TelaMod} />
            <Route path="/admin" component={TelaAdmin} />
          </Switch>
        </div>
      </div>
    </Router>
  );
};

export default AppWrapper;
