/**
 * Created by hamway on 28.03.14.
 */

var Status = {
    params: {},
    chartMemory: '#chartMemory',
    init: function(params) {
        if (params == undefined)
            return false;

        this.params = JSON.parse($('<div />').html(params).text());
        this.setChart();
        this.render();
    },
    setChart: function() {

        /** Set memory */
        var memory = (this.params.Free_Memory / this.params.Total_Memory) * 100;

        $(this.chartMemory).attr('data-percent', memory.toFixed(2));
        $(this.chartMemory).find('.percent').text(memory.toFixed(2));

        /** Set CPus */
        var cpuTimes = [];
        for (var key in this.params.Cpus) {
            cpuTimes[key] = 0;
            for (var tkey in this.params.Cpus[key].times) {
                cpuTimes[key] += this.params.Cpus[key].times[tkey];
            }
        }

        //console.log(cpuTimes);
    },
    render: function () {
        this.renderMemory();
        this.renderCpu()
    },
    renderMemory: function() {
        $(this.chartMemory).easyPieChart({
            easing: 'easeOutBounce',
            onStep: function(from, to, percent) {
                $(this.el).find('.percent').text(percent.toFixed(2));
            }
        });

        setInterval(function() {
            var self = this;
            // TODO: Socket.io
            $.ajax({
                url: '/status/json?memory',
                success: function(memoryObj) {
                    var memory = (memoryObj.Free_Memory / memoryObj.Total_Memory) * 100;
                    $(self.chartMemory).data('easyPieChart').update(memory.toFixed(2) );
                }
            });

        }, 5000);
    },

    renderCpu: function() {

    }
};