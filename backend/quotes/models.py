from django.db import models

class Supplier(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()

    def __str__(self):
        return self.name

class RFQ(models.Model):
    item = models.CharField(max_length=200)
    quantity = models.IntegerField()
    deadline = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.item} x{self.quantity}"

class Bid(models.Model):
    rfq = models.ForeignKey(RFQ, on_delete=models.CASCADE, related_name='bids')
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.supplier} - ₹{self.price}"