var test_data = [
        { name: "LED demo", icon: "/icons/nodejs.svg", url: "#run-app" },
        { name: "PWM motor driver", icon: "/icons/nodejs.svg", url: "#run-app" },
        { name: "ADC acquisition", icon: "/icons/nodejs.svg", url: "#run-app" },
        { name: "Interactive GPIO", icon: "/icons/nodejs.svg", url: "#run-app" },
        { name: "Bouncy ball", icon: "/icons/processing.svg", url: "#run-app" },
];

exports.actions = function(req, res, ss){

  // Easily debug incoming requests here
  console.log(req);

  return {

    // Square a number and return the result
    list: function(){
      res(test_data);
    },
  }
}
