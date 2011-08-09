# PrintJS connector

from os import path as op


import printcore, os, sys, glob, time, threading, traceback, StringIO,  traceback, cStringIO,time

import pronsole

import tornado.web
import tornadio
import tornadio.router
import tornadio.server

ROOT = op.normpath(op.dirname(__file__))

initHardware=False


# global participants list :(        
participants = set()    
PrintRouter=False

def broadcast(message):    
    for p in participants:
        p.send(message)         
    

class PrintController(pronsole.pronsole):
    def __init__(self):
        pronsole.pronsole.__init__(self)
        self.monitor=0
        self.monitor_interval=3
        print "printcontroller init "
        #self.p.connect(self.scanserial()[0],112500)
        if initHardware:
            self.p.connect("/dev/cu.usbserial-A400AQFQ",112500)

    def online(self):
        print "Printer is now online!!"
    def temp(self):
        self.do_gettemp(self.tempcb)
        
    def tempcb(self,l):
        if "T:" in l:
            temp=l.replace("\r","").replace("T","Hotend").replace("B","Bed").replace("\n","").replace("ok ","")
        print temp
        broadcast(temp);

printer = PrintController()

class IndexHandler(tornado.web.RequestHandler):
    """Regular HTTP handler to serve the chatroom page"""
    def get(self):
        self.render("www/index.html")

# client connection
class PrintConnection(tornadio.SocketConnection):
    

    def on_open(self, *args, **kwargs):
        participants.add(self)
        self.send("Connected")

    def on_message(self, message):
        print "message from client:"+message
        if message=="temp":
            broadcast("temp!")    

    def on_close(self):
        participants.remove(self)
#        for p in self.participants:
#            p.send("A user has left.")

#use the routes classmethod to build the correct resource
PrintRouter = tornadio.get_router(PrintConnection)

settings = { "static_path": op.normpath(op.dirname(__file__) + "/www/static") }


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

