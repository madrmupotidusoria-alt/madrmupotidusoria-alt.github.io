<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>SCANORA - Pricing</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://unpkg.com/@supabase/supabase-js"></script>
    <style>
      /* small helpers to mimic the original glow */
      .glow {
        position: absolute;
        width: 600px;
        height: 600px;
        border-radius: 9999px;
        filter: blur(48px);
        background: rgba(59,130,246,0.18);
        left: calc(50% - 300px);
        top: 8rem;
        transform: translate3d(0,0,0);
        animation: float 15s ease-in-out infinite;
        z-index: 0;
      }
      @keyframes float {
        0% { transform: translate(0, 0); }
        33% { transform: translate(100px, -50px); }
        66% { transform: translate(-100px, 50px); }
        100% { transform: translate(0, 0); }
      }
      body { font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="text/babel" data-type="module">
      const { useState, useEffect } = React;
      
      // Initialize Supabase
      const supabase = window.supabase.createClient(
        'https://your-project.supabase.co',
        'your-anon-key'
      );

      function Pricing() {
        const [isLoggedIn, setIsLoggedIn] = useState(false);
        const [selectedPlan, setSelectedPlan] = useState(null);
        const [showPayment, setShowPayment] = useState(false);

        // Check authentication status
        useEffect(() => {
          const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setIsLoggedIn(!!session?.user);
          };

          checkAuth();

          const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsLoggedIn(!!session?.user);
          });

          return () => subscription.unsubscribe();
        }, []);

        const plans = [
          { id: 'basic', title: 'Basic (Crypto)', price: '$20', period: 'month', desc: 'Monthly access paid in crypto.', crypto: true },
          { id: 'premium', title: 'Premium', price: '$50', period: 'month', desc: 'Premium tools and priority support.', crypto: false },
          { id: 'immortal', title: 'Immortal', price: '$100', period: 'month', desc: 'Immortal access — highest tier monthly.', crypto: false },
          { id: 'lifetime', title: 'Lifetime', price: '$200', period: 'one-time', desc: 'One-time lifetime access.', crypto: false }
        ];

        const cryptoWallets = {
          BTC: 'bc1q50p9z8s5y43055ytghsuxvygm2j3rd3cf0m7k2',
          ETH: '0x5b27F2aA61c6a8A762668C45Bd499A495CFe22F5',
          LTC: 'LhCkxUXrk15qpw94z2uGADNDHNwnyAFSD2'
        };

        const handleSubscribe = (plan) => {
          if (!isLoggedIn) {
            alert('Please login to subscribe to a plan');
            return;
          }
          setSelectedPlan(plan);
          setShowPayment(true);
        };

        const copyToClipboard = (text, type) => {
          navigator.clipboard.writeText(text);
          alert(`${type} wallet address copied to clipboard!`);
        };

        const PaymentModal = () => {
          if (!showPayment || !selectedPlan) return null;

          return React.createElement('div', {
            className: "fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          }, 
            React.createElement('div', {
              className: "bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-md w-full"
            }, [
              React.createElement('h2', {
                className: "text-2xl font-bold mb-6 text-center"
              }, "Complete Payment"),
              
              React.createElement('div', {
                className: "mb-6 p-4 bg-gray-800 rounded-lg"
              }, [
                React.createElement('h3', {
                  className: "text-lg font-semibold mb-2"
                }, selectedPlan.title + " Plan"),
                React.createElement('p', {
                  className: "text-2xl font-bold text-blue-400"
                }, selectedPlan.price),
                React.createElement('p', {
                  className: "text-sm text-gray-400"
                }, selectedPlan.desc)
              ]),

              selectedPlan.crypto ? React.createElement('div', {
                className: "space-y-4"
              }, [
                React.createElement('p', {
                  className: "text-center text-gray-300 mb-4"
                }, "Pay with any of the following cryptocurrencies:"),
                
                React.createElement('div', {
                  className: "space-y-3"
                }, [
                  React.createElement('div', {
                    className: "bg-gray-800 p-4 rounded-lg"
                  }, [
                    React.createElement('div', {
                      className: "flex justify-between items-center mb-2"
                    }, [
                      React.createElement('span', {
                        className: "font-semibold text-yellow-500"
                      }, "Bitcoin (BTC)"),
                      React.createElement('button', {
                        onClick: () => copyToClipboard(cryptoWallets.BTC, 'Bitcoin'),
                        className: "px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                      }, "Copy")
                    ]),
                    React.createElement('p', {
                      className: "text-xs text-gray-400 font-mono break-all"
                    }, cryptoWallets.BTC)
                  ]),
                  React.createElement('div', {
                    className: "bg-gray-800 p-4 rounded-lg"
                  }, [
                    React.createElement('div', {
                      className: "flex justify-between items-center mb-2"
                    }, [
                      React.createElement('span', {
                        className: "font-semibold text-purple-500"
                      }, "Ethereum (ETH)"),
                      React.createElement('button', {
                        onClick: () => copyToClipboard(cryptoWallets.ETH, 'Ethereum'),
                        className: "px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                      }, "Copy")
                    ]),
                    React.createElement('p', {
                      className: "text-xs text-gray-400 font-mono break-all"
                    }, cryptoWallets.ETH)
                  ]),
                  React.createElement('div', {
                    className: "bg-gray-800 p-4 rounded-lg"
                  }, [
                    React.createElement('div', {
                      className: "flex justify-between items-center mb-2"
                    }, [
                      React.createElement('span', {
                        className: "font-semibold text-blue-400"
                      }, "Litecoin (LTC)"),
                      React.createElement('button', {
                        onClick: () => copyToClipboard(cryptoWallets.LTC, 'Litecoin'),
                        className: "px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                      }, "Copy")
                    ]),
                    React.createElement('p', {
                      className: "text-xs text-gray-400 font-mono break-all"
                    }, cryptoWallets.LTC)
                  ])
                ]),

                React.createElement('p', {
                  className: "text-sm text-gray-400 text-center mt-4"
                }, "Send payment and contact support with transaction ID for activation")
              ]) : React.createElement('div', {
                className: "text-center"
              }, [
                React.createElement('p', {
                  className: "text-gray-300 mb-4"
                }, "For non-crypto plans, please contact sales"),
                React.createElement('button', {
                  className: "px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                }, "Contact Sales")
              ]),

              React.createElement('div', {
                className: "flex gap-3 mt-6"
              }, [
                React.createElement('button', {
                  onClick: () => setShowPayment(false),
                  className: "flex-1 px-4 py-2 border border-gray-700 rounded-lg hover:bg-gray-800"
                }, "Cancel"),
                React.createElement('button', {
                  onClick: () => {
                    alert('Payment instructions sent! Check your email.');
                    setShowPayment(false);
                  },
                  className: "flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg"
                }, "I've Paid")
              ])
            ])
          );
        };

        return React.createElement('div', {
          className: "min-h-screen bg-black text-white p-8"
        }, [
          React.createElement(PaymentModal),
          
          React.createElement('header', {
            className: "max-w-4xl mx-auto text-center mb-12"
          }, [
            React.createElement('h1', {
              className: "text-4xl font-bold"
            }, "Pricing"),
            React.createElement('p', {
              className: "text-gray-400 mt-3"
            }, [
              "Choose a plan that fits your operational needs. ",
              !isLoggedIn && React.createElement('span', {
                className: "text-yellow-500"
              }, " Please login to subscribe.")
            ])
          ]),

          React.createElement('section', {
            className: "max-w-6xl mx-auto grid gap-8 grid-cols-1 md:grid-cols-4"
          }, plans.map(p => 
            React.createElement('div', {
              key: p.id,
              className: "border border-gray-800 rounded-xl p-6 bg-gray-900/30"
            }, [
              React.createElement('h3', {
                className: "text-xl font-semibold mb-2"
              }, p.title),
              React.createElement('div', {
                className: "text-3xl font-bold mb-2"
              }, [
                p.price,
                React.createElement('span', {
                  className: "text-base font-medium"
                }, p.period === 'month' ? '/mo' : '')
              ]),
              React.createElement('p', {
                className: "text-sm text-gray-400 mb-4"
              }, p.desc),
              React.createElement('ul', {
                className: "text-sm text-gray-300 mb-6 space-y-2"
              }, [
                React.createElement('li', null, "- Secure access"),
                React.createElement('li', null, "- Basic analytics"),
                React.createElement('li', null, "- Community support"),
                p.crypto && React.createElement('li', null, "- Crypto payment accepted")
              ].filter(Boolean)),
              React.createElement('div', {
                className: "flex gap-3"
              }, [
                React.createElement('button', {
                  onClick: () => handleSubscribe(p),
                  className: `flex-1 px-4 py-2 rounded ${
                    isLoggedIn 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-gray-600 cursor-not-allowed'
                  }`,
                  disabled: !isLoggedIn
                }, isLoggedIn ? 'Subscribe' : 'Login Required'),
                React.createElement('button', {
                  className: "px-3 py-2 border border-gray-700 rounded hover:bg-gray-800"
                }, "Details")
              ])
            ])
          )),

          React.createElement('footer', {
            className: "max-w-4xl mx-auto text-center text-gray-500 mt-12"
          }, [
            React.createElement('p', null, "Contact sales for invoices and bulk licensing — crypto payments accepted for Basic plan."),
            !isLoggedIn && React.createElement('p', {
              className: "mt-2 text-yellow-500"
            }, [
              React.createElement('a', {
                href: "/",
                className: "underline hover:text-yellow-400"
              }, "Click here to login or register")
            ])
          ])
        ]);
      }

      // Render the app
      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(React.createElement(Pricing));
    </script>
  </body>
</html>
