/** @param {NS} ns */
export async function main(ns) {
	var target = ns.args[0];
	var minMoney = ns.getServerMaxMoney(target) * 0.75;
	var maxSecurity = ns.getServerMinSecurityLevel(target) +5;
// virus checks server security level and money are acceptable level then hacks server
	while(true){
		if (ns.getServerSecurityLevel(target) > maxSecurity)
		{
			await ns.weaken(target);
		}
		else if(ns.getServerMoneyAvailable(target) < minMoney)
		{
			await ns.grow(target);
		} else{
			await ns.hack(target);
		}
	}

}
