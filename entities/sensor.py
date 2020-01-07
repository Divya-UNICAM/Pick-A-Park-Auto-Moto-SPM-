import requests
import json
import string
import random

class Sensor(object):
    
    class Update(object):
        def __init__(self, ipAddress, plateNumber):
            self.ipAddress = ipAddress
            self.plateNumber = plateNumber
        
        def toJson(self):
           return json.dumps(self) 
    
    def __init__(self, parkingPlace, ipAddress, position):
        self.parkingPlace = parkingPlace
        self.ipAddress = ipAddress
        self.position = position

    def randomPlateNumber(self):
        letters = string.ascii_uppercase
        digits = string.digits
        detectedPlateNumber = random.choice(letters)+random.choice(letters)+random.choice(digits)+random.choice(digits)+random.choice(digits)+random.choice(letters)+random.choice(letters)
        return detectedPlateNumber    

    def sendUpdate(self):
        #Generate update
        update = self.Update(self.ipAddress,self.randomPlateNumber())
        data = update.toJson()
        res = requests.post('http://localhost:3001/api/dashboard/parkingplaces/update',data)
        print(res.status_code)