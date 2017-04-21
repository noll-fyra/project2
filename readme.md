# _Locavorus_
<http://locavorus.herokuapp.com/>

![Locavorus Landing Page](http://i.imgur.com/zBILyBo.png)

## Description

**_Locavorus_** is a (work-in-progress) utility for the hospitality industry that eases the friction of service for restaurants and other food businesses. It aims to solve a fundamental problem that all businesses face: managing the complete life cycle of customer service, from before they patronise the business to well after their meal.

In its current form, it smooths the customer ordering process by sending their orders directly to the kitchen in real time. Customers have constant access to the restaurant's menu and can also ask for service without having to actually get the attention of staff. This results in greater efficiency and a better experience for all stakeholders.

![Rex](http://i.imgur.com/VMuQpkL.png)

**_This is Rex. He likes berries._**

---

## Getting Started
### Prerequisites

This project is built on Node. Go to <https://nodejs.org> and follow the instructions to download and install Node.

### Installing

Fork, clone or download this repository to your desired directory. You have to install the required modules listed in the _package.json_ file. This can be done automatically by entering the following code in your directory:

```
npm install
```
The project will also require a _.env_ file that contains all the secret variables used in the project. Change the file type of the included _.env.sample_ file to _.env_ and replace the values with your own.

---

## Deployment
### Hosting
This project was deployed with Heroku, but you can choose your own server host. To use Heroku, go to <https://www.heroku.com>, create an account and follow the instructions to deploy your own project.

### Database
The project will also require a database. I used mLab, which hosts a MongoDB database (ORM) at <https://mlab.com>.

## Built With
- Node
- Express
- Embedded JavaScript (eJS)
- Socket.io
- JavaScript
- Cloudinary
- HTML5
- CSS
- Skeleton CSS (<http://getskeleton.com>)
- Many other Node modules

---

## The Project
### Background
**_Locavorus_** was inspired by my personal experience as a chef working in the hospitality industry in Melbourne, Australia. I noticed first hand how the restaurant experience could be highly inefficient, which could spell disaster in an industry which lives and dies on very fine profit margins.

### Objective
My aim was to introduce an application to address a few of these inefficiencies, especially with regards to poor service. I'm sure we have all tried, and failed, to attract the attention of waitstaff before. It can be both awkward and embarrassing. My initial goal therefore was to allow the user (customer) to send a request for service to the business (restaurant).

---

## Development
### Models
This was the first rendering of my Entity Relationship Diagram (ERD):

![ERD](http://i.imgur.com/VuKpJNk.jpg)

In the end, I decided to utilise five inter-related models to capture the behaviour: _user_, _business_, _menu item_, _order_ and _transaction_. The user is a _user_; they can register a _business_, which can in turn create _menu items_. When a user visits a business, they send _orders_ which includes details of the item ordered and the user who ordered it. All orders are compiled into a single _transaction_.

### Website Wireframes
My first wireframes were a rough affair, but captured the essential CRUD database actions.
![First Wireframes](http://i.imgur.com/adZznBx.jpg)

After struggling for focus, I drew more detailed wireframes that more closely resemble the final website.
![Second Wireframes 1/3](http://i.imgur.com/DRb5GW3.jpg)
![Second Wireframes 2/3](http://i.imgur.com/gloRxPe.jpg)
![Second Wireframes 3/3](http://i.imgur.com/bYtPx9C.jpg)

### Socket.io
I needed real time communication and updates to achieve my objective, and Socket.io enabled this. It works by starting a 'socket' in the server that is always polling (listening) for data.

```javascript
// start the server listening for connections by client sockets
io.on('connection', (socket) => {
  socketRouter(socket)
})
```

When another socket (the user) sends a message, the server-socket receives it, then sends a message of its own to the socket of its choice. In this way, two-way communication can occur with the server acting as an intermediary, exchanging messages from two different parties.

All connected sockets are always polling for data. Depending on the message a socket receives, a different action will occur. The first message a socket sends is _'join'_.

```javascript
// connect to the business' room
var socket = io.connect()
var room = "<%= chat %>"
socket.on('connect', function() {
    socket.emit('join', room)
    console.log('joining ' + room)
})
```

The message causes the server to put that socket into a specific room.

```javascript
socket.on('join', (room) => {
  console.log('socket joining ' + room)
  socket.join(room)
})
```

 In my implementation, I used the socket of the customer to inform the server of an order or service request. The server then sends the data about the order or service request to the business. This happens almost instantaneously.

![Service Requests](http://i.imgur.com/hSIMlk9.png)

When the server receives a message, before sending it on, it creates, updates or deletes a relevant document in the database. I then used visual trickery through DOM manipulation to update the receiver's UI, essentially showing them what happened in the server.

![Orders](http://i.imgur.com/BhJ3mN3.png)

### Obstacles
#### One-to-One Sockets
I initially encountered problems when trying to send and receive messages to specific clients. The general implementation allows all users to receive all messages. I managed to solve this by getting clients (sockets) to join specific rooms within the server socket based on the business' id. This ensured that only customers of the business could send messages to the business.

#### Deep Population
Due to the multi-nested relationships of my models, and the fact that I utilised referencing rather than embedding, I had issues populating the menu items of transactions, because they were within arrays within arrays of orders within the transaction. I managed to solve this through specifying the specific paths and model of the _menu item_.

```javascript
Transaction.find({business: req.user.business}).populate('customer').populate({path: 'orderedItems', populate: {path: 'menuItem', model: 'MenuItem'}}).exec((err, transactions) => {
  if (err) { res.redirect('back') }
  res.render('business/dashboard', {business: business, transactions: transactions, formatDate: formatDate, cloud: cloudinary.image})
})
```

#### Unhelpful Flash Messages
An unwanted side effect of attempting to populate empty fields is that an error is thrown, even if the rest of the data is found on the server. This kept causing failure flash messages to show up even if nothing was visually wrong the data on the rendered page. I therefore disabled flash messages.

### Points of Interest
#### UnRESTful Routes
I went against a key tenet of RESTful routing and combined multiple resources into a few pages. I made a conscious effort to do this for usability purposes, as I felt that constant loading of pages to access different resources was both a poor experience for the user, and made little sense, especially when the data was related. This meant that I had to implement a lot of JavaScript to manipulate the DOM, but resulted in better UX overall.

For example, I combined the menu items' GET, PUT, POST and DELETE routes together with the business' transactions and profile.

![Dashboard](http://i.imgur.com/RUlN3fr.png)

#### Performance
I began with using jQuery, but removed it halfway through because of loading performance issues fetching the script. I also used Cloudinary to provide image storage and act as a CDN to improve the loading of the site.

#### Working Search Bar
I used RegEx to create a simple (but working!) search bar and it feels great to do searches. It initially crashed if you entered a special character like **{** but that has since been fixed.

```javascript
router.post('/search',(req, res) => {
  var search = new RegExp('^((.*?)(' + req.body.search + ')(.*?))$', 'i')
  Business.find().or([{name: { $regex: search }}, {description: { $regex: search }}, {cuisine: { $regex: search }}]).exec((err, data) => {
    if (err) { throw error }
    res.render('business/index', {allBusinesses: data})
  })
})
```

![Search](http://i.imgur.com/VzoQBJc.png)

#### Flat Design
The site was built using flat design principles, not only for aesthetics, but also because it looks better on mobile tablets, which are a key use case for this site. (And also because it was easier.) The UI was inspired by _Zomato_.

![Buiness Index](http://i.imgur.com/KWhTEjy.png)

### Future
This project is meaningful and solves a real world problem. The eventual goal is to cater for both customers and businesses for the entire service life cycle.

![Locavorus Landing Page](http://i.imgur.com/KEQb77r.png)

---

## Contributing
This is a live project; all code contributions are welcome.

## Author
- Jonathan Louis Ng

## Acknowledgements
### Coding assistance:
- Prima Aulia
- Kenneth Goh
- Cara Chew
- Lee Shue Ze
- Jerel Lim

### Image credits:
- Hero images: Unsplash
- All other images: Google Images
- Logo: Max Alexander Ng

### Inspiration:
- Zomato
