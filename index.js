const express = require("express");
console.log(express);
const server = express();

server.use(express.json());

const projects = [];

//Middleware para verificar se o id existe

function checkID(req, res, next){
    const {id} = req.params;
    const project = projects.find(proj => proj.id === id);

    if (!project) res.status(400).json({error: "O objeto com esse id não existe"});

    req.project = project;

    return next();
}

//Middleware global para a contagem de acessos

function countAccess(req, res, next){
    console.count("Quantidade de requisições");
    return next();
}

server.use(countAccess);

//GET
server.get('/projects', (req, res) => {
  return res.json(projects);
});

//POST
server.post('/projects', (req, res) => {
  const {id, title} = req.body;

  const project = {
      id,
      title,
      tasks:[]
  };
  projects.push(project);

  return res.json(project);
});

//POST TASKS
server.post('/projects/:id/tasks', checkID, (req, res) => {
  const {id} = req.params;
  const {title} = req.body;

  const project = projects.find(proj => proj.id === id);

  project.tasks.push(title);

  return res.json(project);
});

server.listen(3000);

//PUT

server.put("/projects/:id", checkID, (req, res) => {
   const {id} = req.params;
   const {title} = req.body;

    const project = projects.find(proj => proj.id === id);

    project.title = title;

    return res.json(projects);
});

//DELETE

server.delete("/projects/:id", checkID, (req, res) => {
    const{id} = req.params;

    const project = projects.find(proj => proj.id === id);

    projects.splice(project, 1);

    return res.send();
});
