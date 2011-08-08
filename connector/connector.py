# PrintJS connector

from os import path as op

import sys

import tornado.web
import tornadio
import tornadio.router
import tornadio.server

ROOT = op.normpath(op.dirname(__file__))

class IndexHandler(tornado.web.RequestHandler):
    """Regular HTTP handler to serve the chatroom page"""
    def get(self):
        self.render("www/index.html")

class PrintConnection(tornadio.SocketConnection):
    # Class level variable
    participants = set()

    def on_open(self, *args, **kwargs):
        self.participants.add(self)
        self.send("Welcome!")

    def on_message(self, message):
        for p in self.participants:
            p.send(message)

    def on_close(self):
        self.participants.remove(self)
        for p in self.participants:
            p.send("A user has left.")

#use the routes classmethod to build the correct resource
PrintRouter = tornadio.get_router(PrintConnection)

settings = { "static_path": op.normpath(op.dirname(__file__) + "/www/static")}

print settings["static_path"]

#configure the Tornado application
application = tornado.web.Application(
    [(r"/", IndexHandler),
     (r"/(cube\.stl)", tornado.web.StaticFileHandler,
     dict(path=settings['static_path'])),
     
     PrintRouter.route()],
    enabled_protocols = ['websocket',
                         'flashsocket',
                         'xhr-multipart',
                         'xhr-polling'],
    static_path = settings["static_path"],                                     
    flash_policy_port = 843,
    flash_policy_file = op.join(ROOT, 'flashpolicy.xml'),
    socket_io_port = 8001
)

if __name__ == "__main__":
    import logging
    logging.getLogger().setLevel(logging.DEBUG)

    tornadio.server.SocketServer(application)

